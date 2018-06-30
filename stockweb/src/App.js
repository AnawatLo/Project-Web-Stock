import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import firebase from 'firebase'
import Login from './Login'
import Menu from './Menu'
import SettingApprover from './SettingApprover'

export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path='/' component={Login} /> {/* exact เป็นการกันการชนของ path */}
                    <Route path='/Menu' component={Menu} />
                    <Route path='/SettingApprover' component={SettingApprover} />
                </Switch>
            </BrowserRouter>
        );
    }
}
var config = {
    apiKey: "AIzaSyAH5-dHoQxhRDaYF7diyxL-M1xRmLDQRiM",
    authDomain: "stockapplication-202917.firebaseapp.com",
    databaseURL: "https://stockapplication-202917.firebaseio.com",
    projectId: "stockapplication-202917",
    storageBucket: "stockapplication-202917.appspot.com",
    messagingSenderId: "116113221624"
};
firebase.initializeApp(config);

export var fb = firebase