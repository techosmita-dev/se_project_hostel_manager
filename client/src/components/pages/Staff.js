import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from "classnames";
import { createStaffDetails, getStaffDetails } from '../../actions/staffActions';
import axios from 'axios';
import ReactLoading from 'react-loading';

// Inline Icons
const TrashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);
const UserPlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
);

class Staff extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            mobile: '',
            occupation: '',
            errors: {},
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onAvailabilityChange = this.onAvailabilityChange.bind(this);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    async onDelete(_id) {
        if(window.confirm("Are you sure you want to delete this staff member?")) {
            await axios.delete(`/api/staff/${_id}`).then(res => console.log(res)).catch(err => console.log(err));
            await this.props.getStaffDetails();
        }
    }

    async onAvailabilityChange(_id, isAvailable) {
        // Toggle logic handled here
        await axios.put(`/api/staff/availability/${_id}`, { isAvailable: !isAvailable }).then(res => console.log(res)).catch(err => console.log(err));
        await this.props.getStaffDetails();
    }

    async onSubmit(e) {
        e.preventDefault();
        const staffRecord = {
            mobile: this.state.mobile,
            name: this.state.name,
            occupation: this.state.occupation,
        }
        await this.props.createStaffDetails(staffRecord);
        this.setState({
            mobile: '',
            name: '',
            occupation: '',
            errors: {}
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
    }

    async componentDidMount() {
        await this.props.getStaffDetails();
    }

    render() {
        const { staffData, loading } = this.props.staffData;
        const { errors } = this.state;

        let tableContent;
        (!staffData.length || loading) ? (
            tableContent = null
        ) : tableContent = staffData.length ? staffData.map(
            (el, index) => (
                <tr key={el._id} className="align-middle">
                    <th scope="row" className="text-muted pl-4">{index + 1}</th>
                    <td className="font-weight-bold text-dark">{el.name || "-"}</td>
                    <td>
                        <span className="badge badge-light border px-2 py-1">
                            {el.occupation || "-"}
                        </span>
                    </td>
                    <td>
                        {el.mobile ? <a href={`tel:${el.mobile}`} className="text-decoration-none">{el.mobile}</a> : "-"}
                    </td>
                    <td>
                        {el.isAvailable ? (
                            <button 
                                type="button" 
                                className="btn btn-sm btn-success shadow-sm" 
                                style={{borderRadius: '20px', minWidth: '100px', fontSize: '0.85rem'}}
                                onClick={() => this.onAvailabilityChange(el._id, el.isAvailable)}
                                title="Click to mark as Unavailable"
                            >
                                <i className="fas fa-check-circle mr-1"></i> Available
                            </button>
                        ) : (
                            <button 
                                type="button" 
                                className="btn btn-sm btn-secondary shadow-sm" 
                                style={{borderRadius: '20px', minWidth: '100px', fontSize: '0.85rem', opacity: 0.8}}
                                onClick={() => this.onAvailabilityChange(el._id, el.isAvailable)}
                                title="Click to mark as Available"
                            >
                                <i className="fas fa-times-circle mr-1"></i> Unavailable
                            </button>
                        )}
                    </td>
                    <td className="text-center">
                        <button 
                            className="btn btn-outline-danger btn-sm border-0"
                            onClick={() => this.onDelete(el._id)}
                            style={{borderRadius: '50%', width: '35px', height: '35px', padding: 0}}
                            title="Remove Staff"
                        >
                            <TrashIcon />
                        </button>
                    </td>
                </tr>
            )
        ) : (
             <tr>
                <td colSpan="6" className="text-center py-4 text-muted">No staff members found. Add one above.</td>
            </tr>
        );

        return (
            <div className="container-fluid bg-light min-vh-100 py-5">
                <div className="container">
                    
                    {/* Header */}
                    <div className="d-flex align-items-center mb-4">
                        <div className="bg-white p-3 rounded-circle shadow-sm mr-3 text-primary">
                            <i className="fas fa-id-card fa-lg"></i>
                        </div>
                        <div>
                            <h2 className="mb-0 text-dark font-weight-bold">Staff Directory</h2>
                            <p className="text-muted small mb-0">Manage hostel employees and their availability status</p>
                        </div>
                    </div>

                    {/* Add Staff Form */}
                    <div className="card border-0 shadow-sm mb-5" style={{borderRadius: '15px'}}>
                        <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                            <h5 className="text-uppercase text-primary font-weight-bold" style={{fontSize: '0.9rem', letterSpacing: '1px'}}>
                                <UserPlusIcon /> Register New Staff
                            </h5>
                        </div>
                        <div className="card-body px-4 pb-4">
                            <form onSubmit={this.onSubmit}>
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="name" className="small text-muted font-weight-bold">Full Name</label>
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-light border-0"><i className="fas fa-user"></i></span>
                                            </div>
                                            <input type="text" id="name" placeholder="e.g. Robert Smith"
                                                className={classnames("form-control bg-light border-0", { "is-invalid": errors.name })}
                                                onChange={this.onChange} name="name" value={this.state.name}
                                            />
                                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                        </div>
                                    </div>

                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="occupation" className="small text-muted font-weight-bold">Occupation</label>
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-light border-0"><i className="fas fa-briefcase"></i></span>
                                            </div>
                                            <input type="text" id="occupation" placeholder="e.g. Plumber"
                                                className={classnames("form-control bg-light border-0", { "is-invalid": errors.occupation })}
                                                onChange={this.onChange} name="occupation" value={this.state.occupation}
                                            />
                                            {errors.occupation && <div className="invalid-feedback">{errors.occupation}</div>}
                                        </div>
                                    </div>

                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="mobile" className="small text-muted font-weight-bold">Phone Number</label>
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-light border-0"><i className="fas fa-phone"></i></span>
                                            </div>
                                            <input type="number" id="mobile" placeholder="9876543210"
                                                className={classnames("form-control bg-light border-0", { "is-invalid": errors.mobile })}
                                                onChange={this.onChange} name="mobile" value={this.state.mobile}
                                            />
                                            {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
                                        </div>
                                    </div>

                                    <div className="col-md-2 mb-3 d-flex align-items-end">
                                        <button type="submit" className="btn btn-primary w-100 shadow-sm" style={{borderRadius: '8px', fontWeight: '600'}}>
                                            Add Staff
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Staff List Table */}
                    <div className="card border-0 shadow-lg" style={{borderRadius: '15px', overflow: 'hidden'}}>
                        <div className="card-body p-0">
                            <div className="table-responsive" style={{ maxHeight: '700px' }}>
                                {!loading ? (
                                    <table className="table table-hover mb-0">
                                        <thead className="bg-light text-uppercase small text-muted">
                                            <tr>
                                                <th scope="col" className="border-0 py-3 pl-4">#</th>
                                                <th scope="col" className="border-0 py-3">Name</th>
                                                <th scope="col" className="border-0 py-3">Occupation</th>
                                                <th scope="col" className="border-0 py-3">Phone</th>
                                                <th scope="col" className="border-0 py-3">Availability</th>
                                                <th scope="col" className="border-0 py-3 text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tableContent}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="d-flex justify-content-center align-items-center py-5">
                                        <ReactLoading type="bars" color="#4e73df" height={50} width={50} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        );
    }
}

Staff.propTypes = {
    createStaffDetails: PropTypes.func.isRequired,
    getStaffDetails: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    errors: state.errors,
    staffData: state.staffData,
});

export default connect(mapStateToProps, { createStaffDetails, getStaffDetails })(Staff);