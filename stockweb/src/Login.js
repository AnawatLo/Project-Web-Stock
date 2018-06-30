import React from 'react'
import { GoogleLogin } from 'react-google-login'
import './css/styleWeb.css'
import { fb } from './App'
import { Dialog } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';

export default class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loginEmail: '',
            loginName: '',
            width: 0,
            height: 0,
            open: false,
            open2: false
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

    login = (response) => {
        const { email, name } = response.profileObj
        this.setState({
            loginEmail: email,
            loginName: name,
        })
        this.checkEmail(email, name)
    }

    checkEmail = async (email, name) => {
        const employeeID = email
        var dbUser = fb.database().ref('User').on('value', async (snapshot) => {
            const result = snapshot.val()
            const employeeKey = Object.keys(result).filter(key => result[key].employeeID == employeeID)[0]

            if (employeeKey) {
                if (result[employeeKey].typeUser == 'approver' || result[employeeKey].typeUser == 'professor') {
                    this.props.history.push('/Menu', { email, name, typeUser: result[employeeKey].typeUser })
                } else {
                    this.openDialog()
                }
            } else {
                this.openDialog2()
            }
        })
    }
    openDialog2 = () => {
        this.setState({ open2: true });
    }
    openDialog = () => {
        this.setState({ open: true });
    }
    handleClose = () => {
        this.setState({ open: false, open2: false })
    }

    render() {
        console.log('-----------------------------------------------test deploy-------------------------------------')
        const height = this.state.height - 20
        const width = this.state.width - 20
        let heightAndWidth = 0
        if (16.25 / 19 * height < 0.4 * width) {
            heightAndWidth = 16 / 19 * 0.5 * height
        } else {
            heightAndWidth = 0.4 * 0.5 * width
        }
        return (
            <div className='container' style={{
                height: height + 20,
                width: width + 20,
                backgroundSize: width,
            }} >
                <div className='containerTop' style={{
                }}>
                    <p style={{
                        fontSize: 1.5 / 28 * height,
                        fontWeight: 'bolder',
                        color: '#fff',
                        marginBottom: 0.02 * width,
                        marginTop: 0.02 * width,
                    }}>Stock App</p>
                    <p style={{
                        marginTop: 0,
                        fontSize: 1.5 / 32 * height,
                        color: '#fff'
                    }}>ยินดีต้อนรับเข้าสู่เว็บไซต์</p>
                </div>
                <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="simple-dialog-title" >
                    <div className='bodyLP2' style={{
                        height: 0.3 * height,
                        width: 0.3 * width,
                    }} >
                        <InputLabel style={{
                            fontSize: 0.02 * width,
                            marginTop: 0.01 * width,
                            marginBottom: 0.01 * width,
                        }}>บัญชีของคุณไม่ได้รับสิทธิ์ใช้งาน</InputLabel>
                        <div className='btnSet' style={{
                            marginTop: 0.02 * width
                        }} >
                            <button className='btnAddPro1' onClick={() => this.handleClose()}
                                style={{
                                    borderWidth: 0.0015 * width,
                                    borderRadius: 0.02 * 16.25 / 19 * height,
                                    height: 0.028 * width,
                                    width: 0.08 * width,
                                    fontSize: 0.02 * width,
                                    marginLeft: 0.03 * width,
                                    marginRight: 0.03 * width
                                }}>ตกลง</button>
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
                            marginBottom: 0.01 * width,
                        }}>บัญชีของคุณไม่มีในระบบ</InputLabel>
                        <div className='btnSet' style={{
                            marginTop: 0.02 * width
                        }} >
                            <button className='btnAddPro1' onClick={() => this.handleClose()}
                                style={{
                                    borderWidth: 0.0015 * width,
                                    borderRadius: 0.02 * 16.25 / 19 * height,
                                    height: 0.028 * width,
                                    width: 0.08 * width,
                                    fontSize: 0.02 * width,
                                    marginLeft: 0.03 * width,
                                    marginRight: 0.03 * width
                                }}>ตกลง</button>
                        </div>
                    </div>
                </Dialog>
                <div className='containerButtom' style={{
                    backgroundColor: 'rgb(204, 221, 236)'
                }}>
                    <p style={{
                        fontSize: 1.5 / 55 * height,
                        color: 'rgb(15, 69, 88)',
                        marginBottom: 0.02 * width,
                        marginTop: 0.02 * width,
                    }}>@2018 Applied mathematics KMTIL, All Rights Reserved.</p>
                </div>
                <div className='inside' style={{
                    height: 0.65 * height,
                    width: 0.3 * width,
                    marginTop: 0.02 * width,
                    marginBottom: 0.04 * width,
                    borderWidth: 0.008 * width,
                    position: 'absolute'
                }}>
                    <div className='ImgText'>
                        <img className='Img' src={require('./Image/icon.png')} style={{
                            height: 0.5 * heightAndWidth,
                            width: 0.5 * heightAndWidth,
                            marginTop: 0.02 * width,
                            borderRadius: 0.02 * 16.25 / 9 * height,
                        }} />
                        <div className='key'>
                            <p className='textInBox' style={{
                                marginTop: 0.03 * width,
                                fontSize: 1.5 / 32 * height,
                                fontWeight: 'bolder',
                                color: '#000'
                            }} >กรุณาเข้าสู่ระบบ</p>
                            <img src src={require('./Image/key.png')} style={{
                                height: 0.15 * heightAndWidth,
                                width: 0.15 * heightAndWidth,
                                marginLeft: 0.01 * width
                            }} />
                        </div>
                    </div>
                    <GoogleLogin
                        clientId="116113221624-cjv6ucvear75e40ugdck7d08aht0n1uu.apps.googleusercontent.com" // ต้องเอา root ไปเปลี่ยนตรง original url ด้วยนะ 
                        buttonText="เข้าสู่ระบบด้วย Google"
                        onSuccess={(response) => { /* this.responseGoogle(response) */ this.login(response) }}
                        onFailure={(response) => { this.responseGoogle(response) }}
                        className='btnLogin'
                        style={{
                            borderWidth: 0.0015 * width,
                            height: 0.12 * 16.25 / 19 * height,
                            width: 0.6 * 0.4 * width,
                            borderRadius: 0.02 * 16.25 / 19 * height,
                            marginBottom: 0.04 * width,
                            fontSize: 0.05 * 16.25 / 19 * height
                        }}
                    />
                </div>
            </div>
        );
    }
}
