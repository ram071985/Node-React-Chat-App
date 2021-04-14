import React, { component } from 'react';
import StoreContext from './contexts/storeContext';



class Users extends Component {
    static contextType = StoreContext;

    componentDidMount() {
        console.log(this.context);
    }
    render() {
        return (
            <div>
                Dick
            </div>
        )
    }
}

export default Users;