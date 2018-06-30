import React from 'react'
import './css/styleWeb.css'
import Header from './Header'
import ListSettingApprover from './ListSettingApprover'
import XLSX from 'xlsx'
import _ from 'lodash';
import { fb } from './App'
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

export default class HistoryAll extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            width: 0,
            height: 0,
            dataPro: [],
            uploading: false
        };
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

    componentWillMount = () => {
        var dbProduct = fb.database().ref('User');
        dbProduct.on('value', snapshot => {
            this.getData(snapshot.val());
        });
    }
    exportUser = () => {
        const workbook = XLSX.utils.book_new()
        const { dataPro } = this.state
        const aoa = dataPro.map((data) => ([
            data.employeeID,
            data.employeeName,
            data.typeUser,
        ]))
        aoa.unshift(['อีเมล', 'ชื่อ/นามสกุล', 'ประเภทผู้ใช้งาน'])
        aoa.unshift([''])
        aoa.unshift(['', 'รายละเอียดผู้ใช้งาน', ''])
        const sheet = XLSX.utils.aoa_to_sheet(aoa)
        XLSX.utils.book_append_sheet(workbook, sheet, 'รายละเอียดผู้ใช้งาน')
        XLSX.writeFile(workbook, 'รายละเอียดผู้ใช้งาน.xlsx')
    }

    clearLimitUser = () => {
        this.state.dataPro.forEach(checkLimit => {
            const key = checkLimit.key
            var dbClearLimit = fb.database().ref('/User');
            dbClearLimit.child(key).child('Limit').remove()
        });
    }

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
                            <div className='containerPD'>
                                <Header pageName={'ตั้งค่าผู้ยืนยัน'} height={height} width={width} />
                                <div className='topPage2' style={{
                                    height: 3.75 / 19 * height,
                                    width: width,
                                }}>
                                    <button className='btnAddPro' onClick={() => this.clearLimitUser()}
                                        style={{
                                            borderWidth: 0.0015 * width,
                                            height: 0.09 * height,
                                            width: 0.18 * width,
                                            borderRadius: 0.25 * height,
                                            marginTop: 0.05 * height,
                                            marginRight: 0.01 * width,
                                            marginLeft: 0.01 * width,
                                            fontSize: 0.03 * height,
                                        }} >
                                        <div style={{ display: 'flex', flexDirection: 'row', }}>
                                            <img src={require('./Image/Clear.png')}
                                                style={{
                                                    height: 0.1 * heightAndWidth,
                                                    width: 0.1* heightAndWidth,
                                                    margin: '15px 25px',
                                                    marginRight: 0.01 * width,
                                                    justifyContent: 'center'
                                                }} />
                                            <p style={{ display: 'flex', height: 0.12 * heightAndWidth }}>
                                                ล้างประวัติผู้ใช้งาน</p>
                                        </div>
                                    </button>
                                    <button className='btnAddPro' onClick={() => this.exportUser()}
                                        style={{
                                            borderWidth: 0.0015 * width,
                                            height: 0.09 * height,
                                            width: 0.18 * width,
                                            borderRadius: 0.25 * height,
                                            marginTop: 0.05 * height,
                                            marginRight: 0.01 * width,
                                            marginLeft: 0.01 * width,
                                            fontSize: 0.03 * height,
                                        }} >
                                        <div style={{ display: 'flex', flexDirection: 'row', }}>
                                            <img src={require('./Image/Download.png')}
                                                style={{
                                                    height: 0.1 * heightAndWidth,
                                                    width: 0.1 * heightAndWidth,
                                                    margin: '15px 25px',
                                                    marginRight: 0.01 * width,
                                                    justifyContent: 'center'
                                                }} />
                                            <p style={{ display: 'flex', height: 0.12 * heightAndWidth }}>
                                                รายละเอียดผู้ใช้งาน</p>
                                        </div>
                                    </button>
                                </div>
                                <div>
                                    <p className='nameEmail' style={{
                                        fontSize: 1.5 / 20 * height,
                                        fontWeight: 'bolder',
                                        color: ' rgb(15, 69, 88)',
                                        marginTop: 0.15 * height,
                                    }}>รายละเอียดผู้ใช้งาน</p></div>
                                <div style={{
                                    marginTop: 0
                                }}>
                                    <ListSettingApprover />
                                </div>
                            </div>
                        )}
            </div>
        );
    }
} 