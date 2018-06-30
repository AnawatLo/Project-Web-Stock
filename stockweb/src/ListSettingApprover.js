import React, { Component } from 'react';
import { fb } from './App'
import _ from 'lodash';
import './css/styleWeb.css';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Dialog } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';


export default class ListSettingApprover extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataPro: [],
            width: 0,
            height: 0,
            open: false,
            open2: false,
            valueSelect: 0,
            currentDataKey: '',
            originalData: {}
        };
    }

    getData(values) {
        let dataVal = values;
        let data = _(dataVal)
            .keys()
            .map(dataKey => {
                let cloned = _.clone({ ...dataVal[dataKey], key: dataKey });
                cloned.key = dataKey;
                return cloned;
            }).value();
        this.setState({
            dataPro: data
        });
    }

    componentWillMount = () => {
        var dbProduct = fb.database().ref('User');
        dbProduct.on('value', snapshot => {
            this.getData(snapshot.val());
        });
    }
    componentDidMount = () => {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount = () => {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }
    openDialog = (data) => {
        this.setState({ open: true, currentDataKey: data.key, valueSelect: this.type.find(t => t.textE === data.typeUser).value, originalData: data })
    }
    handleClose = () => {
        this.setState({ open: false ,open2:false})
    }
    handleChange = event => {
        this.setState({ valueSelect: event.target.value });
    };
    setOnDB = () => {
        var objUser = {
            typeUser: this.type[this.state.valueSelect].textE
        };
        var dbUpdate = fb.database().ref('/User');
        dbUpdate.child(this.state.currentDataKey).update(objUser)
        this.setState({ open: false });
    }
    resetOnDB = () => {
        this.setState({ valueSelect: this.type.find(t => t.textE === this.state.originalData.typeUser).value });
    }
    deleteUser = () => {
        var dbDelete = fb.database().ref('/User');
        dbDelete.child(this.state.currentDataKey).remove()
        this.setState({ open2: false });
    }
    openDialog2 = (data) => {
        this.setState({ open2: true, currentDataKey: data.key });
    }
    cancle = () => {
        this.setState({ open2: false });
    }
    type = [
        {
            value: 0,
            text: 'นักศึกษา',
            textE: 'student'
        }, {
            value: 1,
            text: 'พนักงาน',
            textE: 'employee'
        },
        {
            value: 2,
            text: 'ผู้ยืนยัน',
            textE: 'approver'
        }
    ]
    render() {
        const height = this.state.height - 20
        const width = this.state.width - 20
        let heightAndWidth = 0
        if (16.25 / 19 * height < 0.4 * width) {
            heightAndWidth = 16 / 19 * 0.5 * height
        } else {
            heightAndWidth = 0.4 * 0.5 * width
        }
        return (
            <div style={{
                marginBottom: 0.02 * width,
            }}>
                <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="simple-dialog-title" >
                    <div className='bodyLP2' style={{
                        height: 0.45 * height,
                        width: 0.35 * width,
                    }} >
                        <InputLabel style={{
                            fontSize: 0.02 * width,
                            marginTop: 0.01 * width,
                            marginBottom: 0.01 * width
                        }}>เลือกประเภทผู้ใช้งาน </InputLabel>
                        <FormControl >
                            <Select
                                value={this.state.valueSelect}
                                onChange={this.handleChange}
                                input={<Input name="age" id="age-helper" />}
                                it
                                style={{
                                    fontSize: 0.015 * width,
                                    marginTop: 0.01 * width,
                                    marginBottom: 0.01 * width
                                }}
                            >
                                <MenuItem value={0}>{this.type[0].text}</MenuItem>
                                <MenuItem value={1}>{this.type[1].text}</MenuItem>
                                <MenuItem value={2}>{this.type[2].text}</MenuItem>
                            </Select>
                            <FormHelperText style={{
                            fontSize: 0.01 * width,
                            marginTop: 0.01 * width,
                            marginBottom: 0.01 * width
                        }}>กรุณาระบุประเภทของผู้ใช้งาน</FormHelperText>
                        </FormControl>
                        <div className='btnSet' style={{
                            marginTop: 0.02 * width
                        }} >
                            <button className='btnAddPro1' onClick={() => this.setOnDB()}
                                style={{
                                    borderWidth: 0.0015 * width,
                                    borderRadius: 0.02 * 16.25 / 19 * height,
                                    height: 0.028 * width,
                                    width: 0.08 * width,
                                    fontSize: 0.02 * width,
                                    marginLeft: 0.03 * width,
                                    marginRight: 0.03 * width
                                }} >ตกลง</button>
                            <button className='btnAddPro2' onClick={() => this.resetOnDB()}
                                style={{
                                    borderWidth: 0.0015 * width,
                                    borderRadius: 0.02 * 16.25 / 19 * height,
                                    height: 0.028 * width,
                                    width: 0.08 * width,
                                    fontSize: 0.02 * width,
                                    marginLeft: 0.03 * width,
                                    marginRight: 0.03 * width
                                }} >รีเซ็ต</button>
                        </div>
                    </div>
                </Dialog>
                <Dialog open={this.state.open2} onClose={this.handleClose} aria-labelledby="simple-dialog-title" >
                    <div className='bodyLP2' style={{
                        height: 0.3 * height,
                        width: 0.3 * width,
                    }} >
                    <InputLabel style={{
                            fontSize: 0.02 * width,
                            marginTop: 0.01 * width,
                            marginBottom: 0.01 * width
                        }}>ต้องการลบผู้ใช้งานรายนี้ ? </InputLabel>
                     <div className='btnSet' style={{
                         marginTop: 0.02 * width
                        }} >
                        <button className='btnAddPro1' onClick={() => this.deleteUser()}
                            style={{
                                borderWidth: 0.0015 * width,
                                borderRadius: 0.02 * 16.25 / 19 * height,
                                height: 0.028 * width,
                                width: 0.08 * width,
                                fontSize: 0.02 * width,
                                marginLeft: 0.03 * width,
                                marginRight: 0.03 * width
                            }} >ตกลง</button>
                        <button className='btnAddPro2' onClick={() => this.cancle()}
                            style={{
                                borderWidth: 0.0015 * width,
                                borderRadius: 0.02 * 16.25 / 19 * height,
                                height: 0.028 * width,
                                width: 0.08 * width,
                                fontSize: 0.02 * width,
                                marginLeft: 0.03 * width,
                                marginRight: 0.03 * width
                            }} >ยกเลิก</button>
                            </div>
                    </div>
                </Dialog>
                <List component="nav">

                    {
                        this.state.dataPro.map((data) => (
                            <div>
                                {
                                    data.typeUser !== 'professor' && (
                                        <ListItem button >
                                            <div key={data.key} className='bodyLP' style={{
                                                height: 0.35 * height,
                                                width: 0.8 * width,
                                                marginTop: 0.01 * width,
                                                marginBottom: 0.01 * width,
                                                borderRadius: 0.02 * 16.25 / 19 * height,
                                            }} >
                                                <div className='CenLP1' style={{
                                                    marginLeft: 0.04 * width,
                                                    height: 0.35 * height,
                                                    width: 0.8 * width,
                                                }}>
                                                    <div>
                                                        <div className='innerImgLP' style={{
                                                            height: 0.6 * heightAndWidth,
                                                            width: 0.6 * heightAndWidth,
                                                            backgroundColor: 'white'
                                                        }}>
                                                            <img style={{ height: 0.5 * heightAndWidth, width: 0.5 * heightAndWidth }}
                                                                src={data.employeePic} />
                                                        </div>
                                                    </div>
                                                    <div className='' style={{
                                                        marginLeft: 0.04 * width,
                                                        width: 0.8 * width,
                                                    }}>
                                                        <p className='text' style={{
                                                            fontSize: 0.05 * 16.25 / 17 * height,
                                                            fontWeight: 'bolder',
                                                        }}>ชื่อ/นามสกุล: ({data.employeeName})</p>
                                                        <p className='text' style={{
                                                            fontSize: 0.05 * 16.25 / 17 * height,
                                                            fontWeight: 'bolder'
                                                        }}>อีเมล: {data.employeeID}</p>
                                                        <p className='text' style={{
                                                            fontSize: 0.05 * 16.25 / 17 * height,
                                                            fontWeight: 'bolder'
                                                        }}>ประเภทผู้ใช้งาน: {data.typeUser}</p>
                                                    </div>
                                                    <div >
                                                        <button className='btnAddPro1' onClick={() => this.openDialog(data)}
                                                            style={{
                                                                borderWidth: 0.0015 * width,
                                                                height: 0.04 * width,
                                                                width: 0.1 * width,
                                                                borderRadius: 0.02 * 16.25 / 19 * height,
                                                                marginRight: 0.05 * width,
                                                                fontSize: 0.04 * height
                                                            }} >
                                                            ตั้งค่า
                                                </button>
                                                        <button className='btnAddPro2' onClick={() => this.openDialog2(data)}
                                                            style={{
                                                                borderWidth: 0.0015 * width,
                                                                height: 0.04 * width,
                                                                marginTop: 0.02 * width,
                                                                width: 0.1 * width,
                                                                borderRadius: 0.02 * 16.25 / 19 * height,
                                                                marginRight: 0.05 * width,
                                                                fontSize: 0.04 * height
                                                            }} >
                                                            ลบ
                                                </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </ListItem>)}
                            </div>
                        ))

                    }
                </List>
            </div>
        )
    }
}