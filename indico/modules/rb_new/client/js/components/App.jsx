/* This file is part of Indico.
 * Copyright (C) 2002 - 2018 European Organization for Nuclear Research (CERN).
 *
 * Indico is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 3 of the
 * License, or (at your option) any later version.
 *
 * Indico is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Indico; if not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {Link, Redirect, Route, Switch} from 'react-router-dom';
import {ConnectedRouter} from 'connected-react-router';
import {Dimmer, Icon, Loader} from 'semantic-ui-react';

import {Translate} from 'indico/react/i18n';
import UserActions from '../containers/UserActions';
import Landing from '../modules/landing';
import Calendar from '../modules/calendar';
import BookRoom from '../modules/bookRoom';
import RoomList from '../modules/roomList';
import BlockingList from '../modules/blockings';
import Menu from './Menu';

import './App.module.scss';


export default class App extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        filtersSet: PropTypes.bool.isRequired,
        isInitializing: PropTypes.bool.isRequired,
        fetchInitialData: PropTypes.func.isRequired,
        resetPageState: PropTypes.func.isRequired
    };

    componentDidMount() {
        const {fetchInitialData} = this.props;
        fetchInitialData();
    }

    render() {
        const {history, filtersSet, resetPageState, isInitializing} = this.props;

        return (
            <ConnectedRouter history={history}>
                <div styleName="rb-layout">
                    <header styleName="rb-menu-bar">
                        <div styleName="rb-menu-bar-side-left">
                            <h1>
                                <Icon name="home" />
                                <Link to="/" onClick={() => resetPageState('bookRoom')}>
                                    <Translate>Room Booking</Translate>
                                </Link>
                            </h1>
                        </div>
                        <div styleName="rb-menu-bar-menu">
                            <Menu />
                        </div>
                        <div styleName="rb-menu-bar-side-right">
                            <UserActions />
                        </div>
                    </header>
                    <div styleName="rb-content">
                        <Switch>
                            <Route exact path="/" render={() => <Redirect to="/book" />} />
                            <Route path="/book" render={({location, match: {isExact}}) => (
                                filtersSet
                                    ? (
                                        <BookRoom location={location} />
                                    ) : (
                                        isExact ? <Landing /> : <Redirect to="/book" />
                                    )
                            )} />
                            <Route path="/rooms" component={RoomList} />
                            <Route path="/blockings" component={BlockingList} />
                            <Route path="/calendar" component={Calendar} />
                        </Switch>
                    </div>
                    <Dimmer.Dimmable>
                        <Dimmer active={isInitializing} page>
                            <Loader />
                        </Dimmer>
                    </Dimmer.Dimmable>
                </div>
            </ConnectedRouter>
        );
    }
}
