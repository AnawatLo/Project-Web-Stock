import React from 'react'
import './css/styleWeb.css'
import Header from './Header'
import XLSX from 'xlsx'
import _ from 'lodash';
import { fb } from './App'
import CircularProgress from '@material-ui/core/CircularProgress';
import { Dialog } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import { resolve } from 'path';

export default class Menu extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            width: 0,
            height: 0,
            dataPro: [],
            dataHis: [],
            dataHisDelete: [],
            dataHisDeletePro: [],
            HistoryAddProduct: [],
            dataHisStockIn: [],
            uploading: false,
            typeUser: '',
            open: false,
        };
        this.Logout = this.Logout.bind(this);
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

    Logout = () => {
        this.props.history.goBack()
        this.props.history.location.state = {}
    }
    openDialog = () => {
        this.setState({ open: true });
    }
    handleClose = () => {
        this.setState({ open: false })
    }
    getData(values) {
        let dataVal = values;
        let data = _(dataVal)
            .keys()
            .map(dataKey => {
                let cloned = _.clone(dataVal[dataKey]);
                cloned.key = dataKey;
                return cloned;
            }).value();
        this.setState({
            dataPro: data,
            uploading: true
        });
    }
    getDataHis(values) {
        let dataVal = values;
        let data = _(dataVal)
            .keys()
            .map(dataKey => {
                let cloned = _.clone({ ...dataVal[dataKey], key: dataKey });
                cloned.key = dataKey;
                return cloned;
            }).value();
        this.setState({
            dataHis: data,
            uploading: true
        });
    }
    getDataHisAddPro(values) {
        let dataVal = values;
        let data = _(dataVal)
            .keys()
            .map(dataKey => {
                let cloned = _.clone(dataVal[dataKey]);
                cloned.key = dataKey;
                return cloned;
            }).value();
        this.setState({
            HistoryAddProduct: data,
            uploading: true
        });
    }
    getDataHisDelete(values) {
        let dataVal = values;
        let data = _(dataVal)
            .keys()
            .map(dataKey => {
                let cloned = _.clone(dataVal[dataKey]);
                cloned.key = dataKey;
                return cloned;
            }).value();
        this.setState({
            dataHisDelete: data,
            uploading: true
        });
    }
    getDataHisDeletePro(values) {
        let dataVal = values;
        let data = _(dataVal)
            .keys()
            .map(dataKey => {
                let cloned = _.clone(dataVal[dataKey]);
                cloned.key = dataKey;
                return cloned;
            }).value();
        this.setState({
            dataHisDeletePro: data,
            uploading: true
        });
    }
    getDataHisStockIn(values) {
        let dataVal = values;
        let data = _(dataVal)
            .keys()
            .map(dataKey => {
                let cloned = _.clone(dataVal[dataKey]);
                cloned.key = dataKey;
                return cloned;
            }).value();
        this.setState({
            dataHisStockIn: data,
            uploading: true
        });
    }

    componentWillMount = () => {
        var dbProduct = fb.database().ref('Product');
        dbProduct.on('value', snapshot => {
            this.getData(snapshot.val());
        });
        var dbHistory = fb.database().ref('History');
        dbHistory.on('value', snapshot => {
            this.getDataHis(snapshot.val());
        });
        var dbHistoryAddPro = fb.database().ref('HistoryAddProduct');
        dbHistoryAddPro.on('value', snapshot => {
            this.getDataHisAddPro(snapshot.val());
        });
        var dbHistoryDelete = fb.database().ref('HistoryDelete');
        dbHistoryDelete.on('value', snapshot => {
            this.getDataHisDelete(snapshot.val());
        });
        var dbHistoryDeletePro = fb.database().ref('HistoryDeleteProduct');
        dbHistoryDeletePro.on('value', snapshot => {
            this.getDataHisDeletePro(snapshot.val());
        });
        var dbHistoryStockIn = fb.database().ref('HistoryStockIn');
        dbHistoryStockIn.on('value', snapshot => {
            this.getDataHisStockIn(snapshot.val());
        });
        this.setState({
            typeUser: this.props.history.location.state.typeUser
        })
    }
    exportProduct = () => {
        const workbook = XLSX.utils.book_new()
        const { dataPro } = this.state
        const aoa = dataPro.map((data) => ([
            data.id,
            data.name,
            data.detail,
            data.quantity
        ]))
        aoa.unshift(['รหัสสินค้า', 'ชื่อสินค้า', 'รายละเอียดสินค้า', 'จำนวนสินค้า'])
        aoa.unshift([''])
        aoa.unshift(['', 'รายการสินค้าคงคลัง'])
        const sheet = XLSX.utils.aoa_to_sheet(aoa)
        XLSX.utils.book_append_sheet(workbook, sheet, 'รายการสินค้า')
        XLSX.writeFile(workbook, 'รายการสินค้า.xlsx')
    }

    exportHistory = async () => {
        await this.checkTimeOneMount();
        const workbook = XLSX.utils.book_new()
        const { dataHis } = this.state
        const { HistoryAddProduct } = this.state
        const { dataHisDelete } = this.state
        const { dataHisDeletePro } = this.state
        const { dataHisStockIn } = this.state
        const aoa1 = HistoryAddProduct.map((data) => ([
            data.id,
            data.name,
            data.detail,
            data.quantity,
            data.limit,
            data.limitStu,
            data.nameApp,
            data.date,
            data.time
        ]))
        aoa1.unshift(['รหัสสินค้า', 'ชื่อสินค้า', 'รายละเอียดสินค้า', 'จำนวนสินค้าที่เพื่ม', 'จำนวนจำกัด(อาจารย์/บุคลากร)', 'จำนวนจำกัด(นักศึกษา)', 'ผู้เพิ่มสินค้า', 'วันที่ (ว/ด/ป)', 'เวลา'])
        aoa1.unshift([''])
        aoa1.unshift(['', 'ประวัติการเพิ่มรายการสินค้า'])
        const sheet2 = XLSX.utils.aoa_to_sheet(aoa1)
        XLSX.utils.book_append_sheet(workbook, sheet2, 'ประวัติการเพิ่มรายการสินค้า')

        const aoa3 = dataHisDeletePro.map((data) => ([
            data.id,
            data.name,
            data.detail,
            data.quantity,
            data.limit,
            data.limitStu,
            data.nameApp,
            data.date,
            data.time
        ]))
        aoa3.unshift(['รหัสสินค้า', 'ชื่อสินค้า', 'รายละเอียดสินค้า', 'จำนวนสินค้าที่ลบ', 'จำนวนจำกัด(อาจารย์/บุคลากร)', 'จำนวนจำกัด(นักศึกษา)', 'ผู้ลบสินค้า', 'วันที่ (ว/ด/ป)', 'เวลา'])
        aoa3.unshift([''])
        aoa3.unshift(['', 'ประวัติการลบรายการสินค้า'])
        const sheet4 = XLSX.utils.aoa_to_sheet(aoa3)
        XLSX.utils.book_append_sheet(workbook, sheet4, 'ประวัติการลบรายการสินค้า')

        const aoa4 = dataHisStockIn.map((data) => ([
            data.id,
            data.name,
            data.detail,
            data.lastQty,
            data.comment,
            data.nameApp,
            data.date,
            data.time
        ]))
        aoa4.unshift(['รหัสสินค้า', 'ชื่อสินค้า', 'รายละเอียดสินค้า', 'จำนวนสินค้าที่เพิ่ม', 'หมายเหตุ', 'ผู้เพิ่มสินค้า', 'วันที่ (ว/ด/ป)', 'เวลา'])
        aoa4.unshift([''])
        aoa4.unshift(['', 'ประวัติการเพิ่มจำนวนสินค้า'])
        const sheet5 = XLSX.utils.aoa_to_sheet(aoa4)
        XLSX.utils.book_append_sheet(workbook, sheet5, 'ประวัติการเพิ่มจำนวนสินค้า')

        const aoa = dataHis.map((data) => ([
            data.id,
            data.name,
            data.detail,
            data.lastQty,
            data.comment,
            data.nameUser,
            data.nameApp,
            data.date,
            data.time
        ]))
        aoa.unshift(['รหัสสินค้า', 'ชื่อสินค้า', 'รายละเอียดสินค้า', 'จำนวนสินค้าที่เบิก', 'หมายเหตุ', 'ผู้เบิก', 'ผู้อนุมัติ', 'วันที่ (ว/ด/ป)', 'เวลา'])
        aoa.unshift([''])
        aoa.unshift(['', 'ประวัติการเบิกสินค้าที่สำเร็จ'])
        const sheet = XLSX.utils.aoa_to_sheet(aoa)
        XLSX.utils.book_append_sheet(workbook, sheet, 'ประวัติการเบิกสินค้าสำเร็จ')

        const aoa2 = dataHisDelete.map((data) => ([
            data.id,
            data.name,
            data.detail,
            data.lastQty,
            data.comment,
            data.nameUser,
            data.nameApp,
            data.date,
            data.time
        ]))
        aoa2.unshift(['รหัสสินค้า', 'ชื่อสินค้า', 'รายละเอียดสินค้า', 'จำนวนสินค้าที่เบิก', 'หมายเหตุ', 'ผู้เบิก', 'ผู้อนุมัติ', 'วันที่ (ว/ด/ป)', 'เวลา'])
        aoa2.unshift([''])
        aoa2.unshift(['', 'ประวัติการเบิกสินค้าที่ไม่สำเร็จ'])
        const sheet3 = XLSX.utils.aoa_to_sheet(aoa2)
        XLSX.utils.book_append_sheet(workbook, sheet3, 'ประวัติการเบิกสินค้าไม่สำเร็จ')
        XLSX.writeFile(workbook, 'ประวัติการทำรายการทั้งหมด.xlsx')
    }

    checkTimeOneMount = () => new Promise((resolve) => {
        this.state.dataHis.forEach(checktime => {
            const key = checktime.key
            const day = parseInt(checktime.date.split("/")[0])
            const mount = parseInt(checktime.date.split("/")[1])
            const year = parseInt(checktime.date.split("/")[2])
            //ของเครื่องคอม
            const currentDay = new Date().getDate();
            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();
            if (year < currentYear) {

            } else if (year == currentYear && mount < currentMonth - 1) {
                var dbDelete = fb.database().ref('/History');
                dbDelete.child(key).remove()
            }
        });
        this.state.dataHisDelete.forEach(checktimeHD => {
            const key = checktimeHD.key
            const day = parseInt(checktimeHD.date.split("/")[0])
            const mount = parseInt(checktimeHD.date.split("/")[1])
            const year = parseInt(checktimeHD.date.split("/")[2])
            const currentDay = new Date().getDate();
            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();
            if (year < currentYear) {

            } else if (year == currentYear && mount < currentMonth - 1) {
                var dbDelete = fb.database().ref('/HistoryDelete');
                dbDelete.child(key).remove()
            }
        })
        this.state.dataHisDeletePro.forEach(checktimeHDP => {
            const key = checktimeHDP.key
            const day = parseInt(checktimeHDP.date.split("/")[0])
            const mount = parseInt(checktimeHDP.date.split("/")[1])
            const year = parseInt(checktimeHDP.date.split("/")[2])
            const currentDay = new Date().getDate();
            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();
            if (year < currentYear) {

            } else if (year == currentYear && mount < currentMonth - 1) {
                var dbDelete = fb.database().ref('/HistoryDeleteProduct');
                dbDelete.child(key).remove()
            }
        })
        this.state.HistoryAddProduct.forEach(checktimeHAP => {
            const key = checktimeHAP.key
            const day = parseInt(checktimeHAP.date.split("/")[0])
            const mount = parseInt(checktimeHAP.date.split("/")[1])
            const year = parseInt(checktimeHAP.date.split("/")[2])
            const currentDay = new Date().getDate();
            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();
            if (year < currentYear) {

            } else if (year == currentYear && mount < currentMonth - 1) {
                var dbDelete = fb.database().ref('/HistoryAddProduct');
                dbDelete.child(key).remove()
            }
        })
        this.state.dataHisStockIn.forEach(checktimeHSI => {
            const key = checktimeHSI.key
            const day = parseInt(checktimeHSI.date.split("/")[0])
            const mount = parseInt(checktimeHSI.date.split("/")[1])
            const year = parseInt(checktimeHSI.date.split("/")[2])
            const currentDay = new Date().getDate();
            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();
            if (year < currentYear) {

            } else if (year == currentYear && mount < currentMonth - 1) {
                var dbDelete = fb.database().ref('/HistoryStockIn');
                dbDelete.child(key).remove()
            }
        })
        resolve()
    })

    render() {
        const height = this.state.height - 20
        const width = this.state.width - 20
        const { name } = this.props.history.location.state
        let heightAndWidth = 0
        if (16.25 / 19 * height < 0.4 * width) {
            heightAndWidth = 16 / 19 * 0.5 * height
        } else {
            heightAndWidth = 0.4 * 0.5 * width
        }
        return (
            <div >
                {
                    !this.state.uploading
                        ?
                        <div className='upload' style={{
                            height: height + 20,
                            width: width + 20,
                        }} >
                            <CircularProgress size={50} />
                        </div>
                        :
                        (
                            <div className='containerPD' style={{
                                height: height + 20,
                                width: width + 20,
                            }}>
                                <Header pageName={'เมนู'} height={height} width={width} />
                                <div className='topPage' style={{
                                    height: 3.75 / 19 * height,
                                    width: width,
                                }}>
                                    <div className='topPage'>
                                        <img className='Logout' src={require('./Image/Logout.png')} onClick={() => this.openDialog()}
                                            style={{
                                                height: 0.25 * heightAndWidth,
                                                width: 0.25 * heightAndWidth,
                                                marginLeft: 0.02 * width,
                                                borderRadius: 0.15 * heightAndWidth,
                                            }} />
                                        <h5 className='nameEmail' style={{
                                            marginLeft: 0.02 * width,
                                            fontSize: 1.5 / 17 * height,
                                            fontWeight: 'bolder',
                                            color: ' rgb(15, 69, 88)'
                                        }}>{name}</h5>
                                    </div>
                                </div>
                                <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="simple-dialog-title" >
                                    <div className='bodyLP2' style={{
                                        height: 0.3 * height,
                                        width: 0.3 * width,
                                    }} >
                                        <InputLabel style={{
                                            fontSize: 0.02 * width,
                                            marginTop: 0.01 * width,
                                            marginBottom: 0.01 * width
                                        }}>ต้องการออกจากระบบ ? </InputLabel>
                                        <div className='btnSet' style={{
                                            marginTop: 0.02 * width
                                        }} >
                                            <button className='btnAddPro1' onClick={() => this.Logout()}
                                                style={{
                                                    borderWidth: 0.0015 * width,
                                                    borderRadius: 0.02 * 16.25 / 19 * height,
                                                    height: 0.028 * width,
                                                    width: 0.08 * width,
                                                    fontSize: 0.02 * width,
                                                    marginLeft: 0.03 * width,
                                                    marginRight: 0.03 * width
                                                }} >ตกลง</button>
                                            <button className='btnAddPro2' onClick={() => this.handleClose()}
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
                                <div className='topPage1' style={{
                                    marginTop: 0.03 * 16.25 / 19 * height,
                                }} >
                                    <div className='bottonImg' style={{
                                        marginLeft: 0.04 * width,
                                        marginRight: 0.04 * width
                                    }}>
                                        <div style={{
                                            height: 1 * heightAndWidth,
                                            width: 1 * heightAndWidth,
                                            alignItems: 'center'
                                        }}>
                                            <button className='btnMenu' onClick={() => this.exportProduct()}
                                                style={{
                                                    borderWidth: 0.003 * width,
                                                    height: 1 * heightAndWidth,
                                                    width: 1 * heightAndWidth,
                                                    borderRadius: 1.5 * heightAndWidth,
                                                }} >
                                                <img src={require('./Image/Product.png')}
                                                    style={{
                                                        height: 0.65 * heightAndWidth,
                                                        width: 0.65 * heightAndWidth,
                                                    }} />
                                            </button></div>
                                        <p className='textInBox2' style={{
                                            marginTop: 0.03 * width,
                                            fontSize: 0.06 * height,
                                            fontWeight: 'bolder',
                                            color: '#000'
                                        }} >รายการสินค้า</p>
                                    </div>
                                    <div className='bottonImg' style={{
                                        marginLeft: 0.04 * width,
                                        marginRight: 0.04 * width
                                    }}>
                                        <div style={{
                                            height: 1 * heightAndWidth,
                                            width: 1 * heightAndWidth,
                                            alignItems: 'center'
                                        }}>
                                            <button className='btnMenu2' onClick={() => this.exportHistory()}
                                                style={{
                                                    borderWidth: 0.003 * width,
                                                    height: 1 * heightAndWidth,
                                                    width: 1 * heightAndWidth,
                                                    borderRadius: 1.5 * heightAndWidth,
                                                }} >
                                                <img src={require('./Image/Transaction.png')}
                                                    style={{
                                                        height: 0.65 * heightAndWidth,
                                                        width: 0.65 * heightAndWidth,
                                                    }} />
                                            </button></div>
                                        <p className='textInBox2' style={{
                                            marginTop: 0.03 * width,
                                            fontSize: 0.06 * height,
                                            fontWeight: 'bolder',
                                            color: '#000'
                                        }} >ประวัติการทำรายการ</p>
                                    </div>
                                    {
                                        this.state.typeUser == 'professor' && (
                                            <div className='bottonImg' style={{
                                                marginLeft: 0.04 * width,
                                                marginRight: 0.04 * width
                                            }}>
                                                <div style={{
                                                    height: 1 * heightAndWidth,
                                                    width: 1 * heightAndWidth,
                                                    alignItems: 'center'
                                                }}>
                                                    <button className='btnMenu3' onClick={() => this.props.history.push('/SettingApprover')}
                                                        style={{
                                                            borderWidth: 0.003 * width,
                                                            height: 1 * heightAndWidth,
                                                            width: 1 * heightAndWidth,
                                                            borderRadius: 1.5 * heightAndWidth,
                                                        }} >
                                                        <img src={require('./Image/Setting.png')}
                                                            style={{
                                                                height: 0.65 * heightAndWidth,
                                                                width: 0.65 * heightAndWidth,
                                                            }} />
                                                    </button></div>
                                                <p className='textInBox2' style={{
                                                    marginTop: 0.03 * width,
                                                    fontSize: 0.06 * height,
                                                    fontWeight: 'bolder',
                                                    color: '#000'
                                                }} >ตั้งค่าผู้ยืนยัน</p>
                                            </div>)}
                                </div>
                            </div>
                        )}
            </div>
        );
    }
}