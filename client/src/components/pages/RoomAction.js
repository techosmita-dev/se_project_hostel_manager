import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from "classnames";
import { createRoomAction, getRoomAction } from '../../actions/roomActions';
import axios from 'axios';
import ReactLoading from 'react-loading';

// Inline Icons
const TrashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);
const ClipboardIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
);

class RoomAction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            block: this.props.match.params.id,
            id: '',
            type: '',
            incharge: '',
            time: '',
            gender: '',
            errors: {},
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    
    async onDelete(_id) {
        if(window.confirm("Are you sure you want to delete this maintenance record?")) {
            await axios.delete(`/api/room/${_id}`).then(res => console.log(res)).catch(err => console.log(err));
            await this.props.getRoomAction(this.props.match.params.id);
        }
    }

    async onSubmit(e) {
        e.preventDefault();
        const activityRecord = {
            type: this.state.type,
            incharge: this.state.incharge,
            block: this.state.block,
            id: this.state.id,
            gender: this.state.gender,
            time: this.state.time,
        }
        await this.props.createRoomAction(activityRecord);
        this.setState({
            incharge: '',
            type: '',
            id: '',
            gender: '',
            time: '',
            errors: {}
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
    }

    async componentDidMount() {
        await this.props.getRoomAction(this.props.match.params.id);
    }

    render() {
        const { roomData, loading } = this.props.roomData;
        const { errors } = this.state;

        let tableContent;
        (!roomData.length || loading) ? (
            tableContent = null
        ) : tableContent = roomData.length ? roomData.map(
            (el, index) => {
                // Determine Badge Color based on action type
                const badgeClass = el.type === 'CLEANING' 
                    ? 'badge badge-info text-white' 
                    : el.type === 'REPAIR' 
                        ? 'badge badge-warning text-dark' 
                        : 'badge badge-secondary';

                return (
                    <tr key={el._id} className="align-middle">
                        <th scope="row" className="text-muted pl-4">{index + 1}</th>
                        <td className="font-weight-bold">#{el.id || "-"}</td>
                        <td>
                            <span className={`${badgeClass} px-3 py-2`} style={{borderRadius: '12px', fontSize: '0.8rem'}}>
                                {el.type || "-"}
                            </span>
                        </td>
                        <td>{el.time || "-"}</td>
                        <td>{el.incharge || "-"}</td>
                        <td>{el.gender || "-"}</td>
                        <td className="text-center">
                            <button 
                                className="btn btn-outline-danger btn-sm border-0"
                                onClick={() => this.onDelete(el._id)}
                                title="Delete Record"
                                style={{borderRadius: '50%', width: '35px', height: '35px', padding: 0}}
                            >
                                <TrashIcon />
                            </button>
                        </td>
                    </tr>
                )
            }
        ) : (
            <tr>
                <td colSpan="7" className="text-center py-4 text-muted">No maintenance records found for Block {this.state.block}.</td>
            </tr>
        );

        return (
            <div className="container-fluid bg-light min-vh-100 py-5">
                <div className="container">
                    
                    {/* Header */}
                    <div className="d-flex align-items-center mb-4">
                        <div className="bg-primary text-white d-flex align-items-center justify-content-center mr-3" 
                             style={{width: '60px', height: '60px', borderRadius: '15px', fontSize: '1.5rem', fontWeight: 'bold'}}>
                            {this.state.block}
                        </div>
                        <div>
                            <h2 className="mb-0 text-dark font-weight-bold">Block {this.state.block} Maintenance</h2>
                            <p className="text-muted small mb-0">Manage cleaning schedules and repair requests</p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="card border-0 shadow-sm mb-5" style={{borderRadius: '15px'}}>
                        <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                            <h5 className="text-uppercase text-primary font-weight-bold" style={{fontSize: '0.9rem', letterSpacing: '1px'}}>
                                <ClipboardIcon /> Log New Activity
                            </h5>
                        </div>
                        <div className="card-body px-4 pb-4">
                            <form onSubmit={this.onSubmit}>
                                <div className="row">
                                    <div className="col-md-2 mb-3">
                                        <label htmlFor="id" className="small text-muted font-weight-bold">Room No.</label>
                                        <input type="text" id="id" placeholder="e.g. 101"
                                            className={classnames("form-control bg-light border-0", { "is-invalid": errors.id })}
                                            onChange={this.onChange} name="id" value={this.state.id}
                                        />
                                        {errors.id && <div className="invalid-feedback">{errors.id}</div>}
                                    </div>

                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="type" className="small text-muted font-weight-bold">Action Type</label>
                                        <select 
                                            className={classnames("form-control bg-light border-0", { "is-invalid": errors.type })}
                                            id="type" onChange={this.onChange} value={this.state.type} name="type"
                                        >
                                            <option value="" disabled>Select Action</option>
                                            <option value="CLEANING">Cleaning</option>
                                            <option value="REPAIR">Repair</option>
                                        </select>
                                        {errors.type && <div className="invalid-feedback">{errors.type}</div>}
                                    </div>

                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="time" className="small text-muted font-weight-bold">Date & Time</label>
                                        <input type="text" id="time" placeholder="YYYY-MM-DD HH:MM"
                                            className={classnames("form-control bg-light border-0", { "is-invalid": errors.time })}
                                            onChange={this.onChange} name="time" value={this.state.time}
                                        />
                                        {errors.time && <div className="invalid-feedback">{errors.time}</div>}
                                    </div>

                                    <div className="col-md-2 mb-3">
                                        <label htmlFor="incharge" className="small text-muted font-weight-bold">Incharge</label>
                                        <input type="text" id="incharge" placeholder="Staff Name"
                                            className={classnames("form-control bg-light border-0", { "is-invalid": errors.incharge })}
                                            onChange={this.onChange} name="incharge" value={this.state.incharge}
                                        />
                                        {errors.incharge && <div className="invalid-feedback">{errors.incharge}</div>}
                                    </div>

                                    <div className="col-md-2 mb-3">
                                        <label htmlFor="gender" className="small text-muted font-weight-bold">Occupancy</label>
                                        <select 
                                            className={classnames("form-control bg-light border-0", { "is-invalid": errors.gender })}
                                            id="gender" onChange={this.onChange} value={this.state.gender} name="gender"
                                        >
                                            <option value="" disabled>Select</option>
                                            <option value="GIRL">Girl</option>
                                            <option value="BOY">Boy</option>
                                        </select>
                                        {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 text-right">
                                        <button type="submit" className="btn btn-primary px-5 shadow-sm" style={{borderRadius: '8px', fontWeight: 'bold'}}>
                                            Submit Log
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="card border-0 shadow-lg" style={{borderRadius: '15px', overflow: 'hidden'}}>
                        <div className="card-body p-0">
                            <div className="table-responsive" style={{ maxHeight: '700px' }}>
                                {!loading ? (
                                    <table className="table table-hover mb-0">
                                        <thead className="bg-light text-uppercase small text-muted">
                                            <tr>
                                                <th scope="col" className="border-0 py-3 pl-4">#</th>
                                                <th scope="col" className="border-0 py-3">Room No.</th>
                                                <th scope="col" className="border-0 py-3">Action</th>
                                                <th scope="col" className="border-0 py-3">Date and Time</th>
                                                <th scope="col" className="border-0 py-3">Incharge</th>
                                                <th scope="col" className="border-0 py-3">Occupancy</th>
                                                <th scope="col" className="border-0 py-3 text-center">Delete</th>
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

RoomAction.propTypes = {
    createRoomAction: PropTypes.func.isRequired,
    getRoomAction: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    errors: state.errors,
    roomData: state.roomData,
});

export default connect(mapStateToProps, { createRoomAction, getRoomAction })(RoomAction);