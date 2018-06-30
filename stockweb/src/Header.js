import React from 'react'
import './css/styleWeb.css'

export default class Import extends React.Component {
    render() {
        const { pageName, height, width } = this.props
        return (
            <div className='containerHeader' style={{
                height: 3.75 / 19 * height,
                width: width + 20,
                borderWidth: 8,
            }}>
                <div className='bodyHeader' style={{
                    flexDirection: 'row',
                }}>
                    <div className='Logo' style={{
                        background: '#ffffff',
                        borderRadius: 1 / 2 * 0.027 * width,
                        borderWidth: 3,
                        borderColor: '#BEBEBE',
                        height: 0.07 * width,
                        width: 0.07 * width,
                        marginLeft: 0.02 * width,
                        marginRight: 0.02 * width,
                    }}>
                        <img src={require('./Image/icon.png')} style={{
                            alignItems: 'center',
                            height: 0.07 * width,
                            width: 0.07 * width
                        }} />
                    </div>
                    <p className='p1'
                        style={{
                            fontSize: 1.5 / 17 * height,
                            fontWeight: 'bolder',
                            color: '#fff'
                        }}>
                        STOCK APP
                    </p>
                </div>
                <p className='p2'
                    style={{
                        marginRight: 0.04 * width,
                        fontSize: 1.5 / 16 * height,
                        fontWeight: 'bold',
                        color: '#fff',
                    }}>
                    {pageName}
                </p>
            </div>
        );
    }
} 