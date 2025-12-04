import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { 
    createStudentDetails, 
    getStudentDetails, 
    updateStudentStatus, 
    deleteStudent,
    clearErrors
} from '../../actions/studentDetailsActions';

// Inline Icons to avoid external dependencies
const TrashIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);

const UserIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

class StudentDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            batch: this.props.match.params.id,
            name: '',
            email: '',
            id: '',
            gender: '',
            room: '',
            block: '',
            isAvailable: true,
            errors: {}
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onStatusChange = this.onStatusChange.bind(this);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    async onSubmit(e) {
        e.preventDefault();
        
        // Check if user is admin
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.role === 'admin') {
            alert('Admins are not allowed to add students. Please log in with a staff account.');
            return;
        }
        
        console.log('Form submitted with data:', {
            ...this.state,
            password: '***' // Don't log password
        });
        
        this.setState({ loading: true, errors: {} });

        const studentDetailsData = {
            name: this.state.name?.trim() || '',
            email: this.state.email?.trim() || '',
            batch: parseInt(this.state.batch, 10),
            id: this.state.id?.trim() || '',
            room: this.state.room?.trim() || '',
            block: this.state.block?.trim().toUpperCase() || '',
            gender: this.state.gender ? this.state.gender.toUpperCase() : '',
            isAvailable: this.state.isAvailable
        };

        // Client-side validation
        const errors = {};
        
        if (!studentDetailsData.name) errors.name = 'Name is required';
        if (!studentDetailsData.email) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentDetailsData.email)) {
            errors.email = 'Please enter a valid email address';
        }
        if (!studentDetailsData.id) errors.id = 'Student ID is required';
        if (!studentDetailsData.gender) errors.gender = 'Gender is required';
        if (!studentDetailsData.block) errors.block = 'Block is required';
        if (!studentDetailsData.room) errors.room = 'Room is required';
        
        if (Object.keys(errors).length > 0) {
            console.log('Validation errors:', errors);
            this.setState({ errors, loading: false });
            return;
        }
        
        try {
            console.log('Submitting student data:', studentDetailsData);
            const result = await this.props.createStudentDetails(studentDetailsData);
            console.log('Response from createStudentDetails:', result);
            
            if (result && result.success) {
                // Reset form on success
                this.setState({
                    name: '',
                    email: '',
                    id: '',
                    room: '',
                    block: '',
                    gender: '',
                    errors: {}
                });
                console.log('Student added successfully!');
            } else {
                // Show error message to user
                const errorMessage = result?.error?.message || 'Failed to add student. Please try again.';
                alert(errorMessage);
                console.error('Failed to add student:', result?.error);
                this.setState({
                    errors: {
                        ...this.state.errors,
                        submit: errorMessage
                    }
                });
            }
        } catch (error) {
            console.error('Form submission error:', error);
            let errorMessage = 'An error occurred while submitting the form.';
            
            // Handle 403 Forbidden error specifically
            if (error.response && error.response.status === 403) {
                errorMessage = 'You do not have permission to perform this action. Please log in with a staff account.';
            }
            
            alert(errorMessage);
            this.setState({
                errors: { 
                    ...this.state.errors,
                    submit: errorMessage
                }
            });
        } finally {
            this.setState({ loading: false });
        }
    }

async onDelete(id) {
        const result = await this.props.deleteStudent(id, this.props.match.params.id);
        if (result && !result.success && !result.cancelled) {
            // Error is already handled in the action
            console.error('Failed to delete student:', result.error);
        }
    }

    async onStatusChange(id, isAvailable) {
        const result = await this.props.updateStudentStatus(id, isAvailable);
        if (result && !result.success) {
            // Error is already handled in the action
            console.error('Failed to update student status:', result.error);
        } else {
            // Refresh the student list
            this.props.getStudentDetails(this.props.match.params.id);
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
    }
    
    async componentDidMount() {
        await this.props.getStudentDetails(this.props.match.params.id);
    }

    componentDidUpdate(prevProps) {
        // Update errors from Redux store
        if (this.props.errors !== prevProps.errors) {
            this.setState({ errors: this.props.errors });
        }
    }
    
    componentWillUnmount() {
        // Clear errors when component unmounts
        this.props.clearErrors();
    }

    render() {
        // Add null check for this.props.student
        const { student } = this.props;
        const studentData = student?.studentData || [];
        const { errors = {}, loading = false } = this.state;
        
        let tableContent;
        if (loading) {
            tableContent = (
                <tr>
                    <td colSpan="9" className="text-center py-4">
                        <div className="d-flex justify-content-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    </td>
                </tr>
            );
        } else if (!studentData || studentData.length === 0) {
            tableContent = (
                <tr>
                    <td colSpan="9" className="text-center py-4 text-muted">
                        No students found in this batch.
                    </td>
                </tr>
            );
        } else {
            tableContent = studentData.map((el, index) => (
                <tr key={el._id} className="align-middle">
                    <th scope="row" className="text-muted">{index + 1}</th>
                    <td className="fw-bold text-dark">{el.name || "-"}</td>
                    <td className="text-secondary">{el.email || "-"}</td>
                    <td><span className="badge badge-light text-dark border">{el.id || "-"}</span></td>
                    <td>{el.block || "-"}</td>
                    <td>{el.room || "-"}</td>
                    <td>{el.gender || "-"}</td>
                    <td>
                        {el.isAvailable ? (
                            <button 
                                type="button" 
                                className="btn btn-sm btn-success shadow-sm" 
                                style={{borderRadius: '20px', minWidth: '80px'}}
                                onClick={() => this.onStatusChange(el.id, el.isAvailable)}
                            >
                                Present
                            </button>
                        ) : (
                            <button 
                                type="button" 
                                className="btn btn-sm btn-danger shadow-sm"
                                style={{borderRadius: '20px', minWidth: '80px'}} 
                                onClick={() => this.onStatusChange(el.id, el.isAvailable)}
                            >
                                Absent
                            </button>
                        )}
                    </td>
                    <td className="text-center">
                        <button 
                            className="btn btn-outline-danger btn-sm border-0"
                            onClick={() => this.onDelete(el.id)}
                            title="Delete Student"
                        >
                            <TrashIcon />
                        </button>
                    </td>
                </tr>
            ));
        }

        return (
            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="d-flex align-items-center">
                                    <UserIcon />
                                    Student Details
                                </h4>
                            </div>
                            <div className="card-body">
                                <form onSubmit={this.onSubmit}>
                                <div className="form-group">
                                    <label>Name *</label>
                                    <input 
                                        type="text" 
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`} 
                                        placeholder="Enter student name" 
                                        name="name" 
                                        value={this.state.name} 
                                        onChange={this.onChange} 
                                    />
                                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                </div>
                                
                                <div className="form-group">
                                    <label>Email *</label>
                                    <input 
                                        type="email" 
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
                                        placeholder="Enter email address" 
                                        name="email" 
                                        value={this.state.email} 
                                        onChange={this.onChange} 
                                    />
                                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                </div>
                                
                                <div className="form-group">
                                    <label>Student ID *</label>
                                    <input 
                                        type="text" 
                                        className={`form-control ${errors.id ? 'is-invalid' : ''}`} 
                                        placeholder="Enter student ID" 
                                        name="id" 
                                        value={this.state.id} 
                                        onChange={this.onChange} 
                                    />
                                    {errors.id && <div className="invalid-feedback">{errors.id}</div>}
                                </div>
                                
                                <div className="form-group">
                                    <label>Gender *</label>
                                    <select 
                                        className={`form-control ${errors.gender ? 'is-invalid' : ''}`} 
                                        name="gender" 
                                        value={this.state.gender} 
                                        onChange={this.onChange}
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                                </div>
                                
                                <div className="form-group">
                                    <label>Block *</label>
                                    <select 
                                        className={`form-control ${errors.block ? 'is-invalid' : ''}`} 
                                        name="block" 
                                        value={this.state.block} 
                                        onChange={this.onChange}
                                        required
                                    >
                                        <option value="">Select Block</option>
                                        <option value="A">Block A</option>
                                        <option value="B">Block B</option>
                                        <option value="C">Block C</option>
                                        <option value="D">Block D</option>
                                    </select>
                                    {errors.block && <div className="invalid-feedback">{errors.block}</div>}
                                </div>
                                
                                <div className="form-group">
                                    <label>Room *</label>
                                    <input 
                                        type="text" 
                                        className={`form-control ${errors.room ? 'is-invalid' : ''}`} 
                                        placeholder="Enter room number" 
                                        name="room" 
                                        value={this.state.room} 
                                        onChange={this.onChange} 
                                    />
                                    {errors.room && <div className="invalid-feedback">{errors.room}</div>}
                                </div>
                                
                                <div className="form-group form-check">
                                    <input 
                                        type="checkbox" 
                                        className="form-check-input" 
                                        name="isAvailable" 
                                        checked={this.state.isAvailable} 
                                        onChange={(e) => this.setState({ isAvailable: e.target.checked })}
                                    />
                                    <label className="form-check-label">Is Available</label>
                                </div>
                                
                                <button type="submit" className="btn btn-primary">
                                    {this.state.loading ? (
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                        'Submit'
                                    )}
                                </button>
                                </form>
                            </div>
                        </div>
                        
                        <div className="card mt-4">
                            <div className="card-header">
                                <h5>Students List</h5>
                            </div>
                            <div className="card-body">
                                {studentData && studentData.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Student ID</th>
                                                    <th>Gender</th>
                                                    <th>Block</th>
                                                    <th>Room</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tableContent}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p>No students found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    static propTypes = {
        student: PropTypes.shape({
            studentData: PropTypes.arrayOf(PropTypes.shape({
                _id: PropTypes.string,
                name: PropTypes.string,
                email: PropTypes.string,
                id: PropTypes.string,
                block: PropTypes.string,
                room: PropTypes.string,
                gender: PropTypes.string,
                isAvailable: PropTypes.bool
            }))
        }),
        createStudentDetails: PropTypes.func.isRequired,
        getStudentDetails: PropTypes.func.isRequired,
        updateStudentStatus: PropTypes.func.isRequired,
        deleteStudent: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired,
        errors: PropTypes.object,
        match: PropTypes.shape({
            params: PropTypes.shape({
                id: PropTypes.string.isRequired
            }).isRequired
        }).isRequired
    };

    static defaultProps = {
        student: { studentData: [] },
        errors: {}
    };
}

// Map state to props
const mapStateToProps = state => ({
    student: state.studentDetails || { studentData: [] },
    errors: state.errors || {}
});

export default connect(mapStateToProps, { 
    createStudentDetails, 
    getStudentDetails, 
    updateStudentStatus, 
    deleteStudent,
    clearErrors 
})(StudentDetails);
