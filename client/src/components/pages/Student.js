// import React, { Component } from 'react';
// import classnames from "classnames";
// import axios from 'axios';
// import ReactLoading from 'react-loading';

// class Student extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             findBy: '',
//             val: '',
//             data: {},
//             loading: false,
//             errors: {},
//         }
//         this.onChange = this.onChange.bind(this);
//         this.onFtechDetails = this.onFtechDetails.bind(this);
//         this.onDelete = this.onDelete.bind(this);
//         this.onStatusChange = this.onStatusChange.bind(this);
//     }
//     onChange(e) {
//         this.setState({ [e.target.name]: e.target.value });
//     }
//     async onDelete(id) {
//         await axios.delete(`/api/student`, { data: { id } }).then(res => console.log(res)).catch(err => console.log(err));
//         await this.onFtechDetails();
//     }
//     async onStatusChange(id, isAvailable) {
//         await axios.put(`/api/student/availability`, { id, isAvailable: !isAvailable }).then(res => console.log(res)).catch(err => console.log(err));
//         await this.onFtechDetails();
//     }
//     async onFtechDetails() {
//         this.setState({ loading: true });
//         if (this.state.findBy === 'id') {
//             await axios.get(`/api/student/id/${this.state.val}`).then((res) => {
//                 this.setState({ data: res, loading: false });
//                 console.log(res);
//                 if (!res.data.length) {
//                     alert("Not Found");
//                 }
//             }).catch(err =>
//                 console.log(err)
//             );
//         }
//         else if (this.state.findBy === 'room') {
//             await axios.get(`/api/student/room/${this.state.val}`).then((res) => {
//                 this.setState({ data: res, loading: false });
//                 console.log(res);
//                 if (!res.data.length) {
//                     alert("Not Found");
//                 }
//             }
//             ).catch(err =>
//                 console.log(err)
//             );
//         } else if (this.state.findBy === 'isAvailable') {
//             await axios.get(`/api/student/all`).then((res) => {
//                 let tempVal = this.state.val;
//                 tempVal = tempVal.trim().toLowerCase();
//                 if (tempVal === 'absent') {
//                     tempVal = false
//                 } else if (tempVal === 'present') {
//                     tempVal = true
//                 } else {
//                     this.setState({ loading: false })
//                     return alert("Input can be 'absent' or 'present' only!");
//                 }
//                 const filteredData = res.data ? res.data.filter(el => el.isAvailable === tempVal
//                 ) : [];
//                 const data = {
//                     data: filteredData
//                 }
//                 this.setState({ data: data, loading: false });
//                 if (!filteredData.length) {
//                     alert("Not Found");
//                 }
//             }
//             ).catch(err =>
//                 console.log(err)
//             );
//         } else {
//             this.setState({ loading: false })
//             return alert('Select Room number or Student Id?');
//         }
//     }
//     onBatchSelect(batch) {
//         this.props.history.push(`/studentdetails/${batch}`);
//     }
//     render() {
//         const { errors, data, loading } = this.state;
//         let tableContent;
//         (!data) ? (
//             tableContent = null
//         ) : tableContent = data.data ? data.data.map(
//             el =>
//                 <tr key={el._id} >
//                     <th scope="row">{data.data.indexOf(el) + 1}</th>
//                     <td>{el.name ? el.name : "-"}</td>
//                     <td>{el.email ? el.email : "-"}</td>
//                     <td>{el.id ? el.id : "-"}</td>
//                     <td>{el.block ? el.block : "-"}</td>
//                     <td>{el.room ? el.room : "-"}</td>
//                     <td>{el.gender ? el.gender : "-"}</td>
//                     <td>{el.isAvailable ? <button type="button" className="btn btn-primary" data-toggle="tooltip" data-placement="right" title="Click to Mark Absent"
//                         onClick={() => this.onStatusChange(el.id, el.isAvailable)}
//                     >
//                         Present
//                     </button>
//                         : <button type="button" className="btn btn-danger" data-toggle="tooltip" data-placement="right" title="Click to Mark Present"
//                             onClick={() => this.onStatusChange(el.id, el.isAvailable)}
//                         >
//                             Absent
//                     </button>}</td>
//                     <td style={{ cursor: 'pointer', color: '#00a4eb' }}
//                         onClick=
//                         {() => this.onDelete(el.id)}
//                     >
//                         Click Me
//                     </td>
//                 </tr>
//         ) : null

//         return (
//             <div className="mid container">
//                 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                     <div className="card" style={{ width: "12rem" }}>
//                         <div className="card-body">
//                             <h5 className="card-title">B.Tech-2022</h5>
//                             <h6 className="card-subtitle mb-2 text-muted">CS & IT</h6>
//                             <p onClick={() => this.onBatchSelect('2022')} className="card-text" style={{
//                                 cursor: 'pointer',
//                                 color: '#00a4eb'
//                             }}>Add or Check Info</p>
//                         </div>
//                     </div>
//                     <div className="card" style={{ width: "12rem" }}>
//                         <div className="card-body">
//                             <h5 className="card-title">B.Tech-2023</h5>
//                             <h6 className="card-subtitle mb-2 text-muted">CS & IT</h6>
//                             <p onClick={() => this.onBatchSelect('2023')} className="card-text" style={{
//                                 cursor: 'pointer',
//                                 color: '#00a4eb'
//                             }}>Add or Check Info</p>
//                         </div>
//                     </div>
//                     <div className="card" style={{ width: "12rem" }}>
//                         <div className="card-body">
//                             <h5 className="card-title">B.Tech-2024</h5>
//                             <h6 className="card-subtitle mb-2 text-muted">CS & IT</h6>
//                             <p onClick={() => this.onBatchSelect('2024')} className="card-text" style={{
//                                 cursor: 'pointer',
//                                 color: '#00a4eb'
//                             }}>Add or Check Info</p>
//                         </div>
//                     </div>
//                     <div className="card" style={{ width: "12rem" }}>
//                         <div className="card-body">
//                             <h5 className="card-title">B.Tech-2025</h5>
//                             <h6 className="card-subtitle mb-2 text-muted">CS & IT</h6>
//                             <p onClick={() => this.onBatchSelect('2025')} className="card-text" style={{
//                                 cursor: 'pointer',
//                                 color: '#00a4eb'
//                             }}>Add or Check Info</p>
//                         </div>
//                     </div>
//                 </div>
//                 <br />
//                 <label htmlFor="find" style={{ marginLeft: '14px' }}><h5>Find By</h5></label>
//                 <div className="col-8 input-group-prepend">
//                     <select className={classnames("form-control", {
//                         "is-invalid": errors.room
//                     })}
//                         id="find" onChange={this.onChange} value={this.state.findBy}
//                         name="findBy"
//                     >   <option value="" defaultValue disabled>Select</option>
//                         <option value="id">Student Id</option>
//                         <option value="room">Room No.</option>
//                         <option value="isAvailable">Absent/Present</option>
//                     </select>
//                     <input type="text" id="val" placeholder="Value"
//                         className={classnames("form-control", {
//                             "is-invalid": errors.room
//                         })}
//                         onChange={this.onChange}
//                         name="val"
//                         value={this.state.val}
//                         required={true}
//                     />
//                     {errors.room && (
//                         <div className="invalid-tooltip">{errors.room}</div>
//                     )}
//                     <button className="btn btn-primary" style={{ fontSize: '12px', width: '200px' }} onClick={this.onFtechDetails}>Find Details</button>
//                 </div>
//                 <div style={{ marginTop: '50px', overflow: 'scroll', maxHeight: 800 }}>
//                     {!loading ? <table className="table table-striped table-hover">
//                         <thead className="thead-dark">
//                             <tr>
//                                 <th scope="col">#</th>
//                                 <th scope="col">Name</th>
//                                 <th scope="col">Email</th>
//                                 <th scope="col">ID</th>
//                                 <th scope="col">Block</th>
//                                 <th scope="col">Room No.</th>
//                                 <th scope="col">Gender</th>
//                                 <th scope="col">Leave Status</th>
//                                 <th scope="col">Delete?</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {tableContent}
//                         </tbody>
//                     </table> : <div style={{ display: 'flex', justifyContent: 'center' }}><ReactLoading type="bars" color="#f56f42" /></div>
//                     }
//                 </div>
//             </div>
//         );
//     }
// }

// export default Student;

import React, { useState } from 'react';
import classnames from "classnames";
import axios from 'axios';
import ReactLoading from 'react-loading';
import { FaSearch, FaTrash, FaUserCheck, FaUserTimes, FaGraduationCap, FaBuilding } from 'react-icons/fa'; // Requires: npm install react-icons

const Student = ({ history }) => {
    // State Management
    const [findBy, setFindBy] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // --- Actions ---

    const handleBatchSelect = (batch) => {
        history.push(`/studentdetails/${batch}`);
    };

    const fetchStudentData = async () => {
        if (!findBy) return setError("Please select a search criteria.");
        if (!searchValue) return setError("Please enter a value to search.");
        
        setLoading(true);
        setError('');
        setStudents([]);

        try {
            let res;
            if (findBy === 'id') {
                res = await axios.get(`/api/student/id/${searchValue}`);
            } else if (findBy === 'room') {
                res = await axios.get(`/api/student/room/${searchValue}`);
            } else if (findBy === 'isAvailable') {
                const term = searchValue.trim().toLowerCase();
                let boolVal;
                
                if (term === 'absent') boolVal = false;
                else if (term === 'present') boolVal = true;
                else {
                    setLoading(false);
                    return setError("Input must be 'absent' or 'present'");
                }

                const allRes = await axios.get(`/api/student/all`);
                const filtered = allRes.data ? allRes.data.filter(el => el.isAvailable === boolVal) : [];
                res = { data: filtered };
            }

            if (!res.data || res.data.length === 0) {
                setError("No records found.");
            } else {
                // Ensure data is always an array
                setStudents(Array.isArray(res.data) ? res.data : [res.data]); 
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred while fetching data.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if(!window.confirm("Are you sure you want to delete this student?")) return;
        
        try {
            await axios.delete(`/api/student`, { data: { id } });
            fetchStudentData(); // Refresh list
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusChange = async (id, currentStatus) => {
        try {
            await axios.put(`/api/student/availability`, { id, isAvailable: !currentStatus });
            fetchStudentData(); // Refresh list
        } catch (err) {
            console.error(err);
        }
    };

    // --- Sub-Components ---

    const BatchCard = ({ year }) => (
        <div className="card batch-card" onClick={() => handleBatchSelect(year)}>
            <div className="card-body text-center">
                <div className="icon-bg mb-3">
                    <FaGraduationCap size={24} color="#fff" />
                </div>
                <h5 className="card-title font-weight-bold">Batch {year}</h5>
                <h6 className="card-subtitle mb-2 text-muted">CS & IT Department</h6>
                <span className="btn-link-custom">View Details &rarr;</span>
            </div>
        </div>
    );

    return (
        <div className="container-fluid p-5" style={styles.pageContainer}>
            
            {/* Header Section */}
            <div className="row mb-5">
                <div className="col-12 text-center">
                    <h2 style={styles.headerTitle}>Student Management Dashboard</h2>
                    <p className="text-muted">Manage batches, availability, and student records.</p>
                </div>
            </div>

            {/* Batch Selection Cards */}
            <div className="row justify-content-center mb-5">
                {['2022', '2023', '2024', '2025'].map(year => (
                    <div key={year} className="col-md-6 col-lg-3 mb-4">
                        <BatchCard year={year} />
                    </div>
                ))}
            </div>

            {/* Search Section */}
            <div className="card shadow-sm border-0 mb-5" style={{ borderRadius: '15px' }}>
                <div className="card-body p-4">
                    <h5 className="mb-4" style={{ color: '#444' }}><FaSearch className="mr-2"/> Find Students</h5>
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <select 
                                className="form-control custom-select-lg"
                                value={findBy}
                                onChange={(e) => setFindBy(e.target.value)}
                                style={styles.input}
                            >
                                <option value="" disabled>Search Criteria...</option>
                                <option value="id">Student ID</option>
                                <option value="room">Room Number</option>
                                <option value="isAvailable">Status (Absent/Present)</option>
                            </select>
                        </div>
                        <div className="col-md-5 mb-3">
                            <input 
                                type="text" 
                                className="form-control custom-input-lg"
                                placeholder="Enter value (e.g. 101, absent, Room-A)"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                style={styles.input}
                            />
                        </div>
                        <div className="col-md-3">
                            <button 
                                className="btn btn-primary btn-block btn-lg" 
                                onClick={fetchStudentData}
                                style={styles.searchBtn}
                            >
                                Search Records
                            </button>
                        </div>
                    </div>
                    {error && <div className="alert alert-warning mt-3" role="alert">{error}</div>}
                </div>
            </div>

            {/* Data Table Section */}
            <div className="card shadow border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                <div className="card-body p-0">
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center p-5">
                            <ReactLoading type="bars" color="#6c63ff" height={50} width={50} />
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead style={styles.tableHead}>
                                    <tr>
                                        <th className="py-3 pl-4">#</th>
                                        <th className="py-3">Name</th>
                                        <th className="py-3">Email</th>
                                        <th className="py-3">ID</th>
                                        <th className="py-3">Block / Room</th>
                                        <th className="py-3">Gender</th>
                                        <th className="py-3 text-center">Status</th>
                                        <th className="py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.length > 0 ? students.map((el, index) => (
                                        <tr key={el._id} style={{ verticalAlign: 'middle' }}>
                                            <th scope="row" className="pl-4">{index + 1}</th>
                                            <td className="font-weight-bold">{el.name || "-"}</td>
                                            <td className="text-muted small">{el.email || "-"}</td>
                                            <td><span className="badge badge-light border">{el.id || "-"}</span></td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <FaBuilding className="text-muted mr-2"/> 
                                                    {el.block || "?"} - {el.room || "?"}
                                                </div>
                                            </td>
                                            <td>{el.gender || "-"}</td>
                                            <td className="text-center">
                                                <button 
                                                    className={classnames("btn btn-sm shadow-sm", {
                                                        "btn-success": !el.isAvailable,
                                                        "btn-warning": el.isAvailable
                                                    })}
                                                    style={{ width: '100px', borderRadius: '20px' }}
                                                    onClick={() => handleStatusChange(el.id, el.isAvailable)}
                                                >
                                                    {el.isAvailable ? (
                                                        <span><FaUserTimes/> Mark Absent</span>
                                                    ) : (
                                                        <span><FaUserCheck/> Mark Present</span>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="text-center">
                                                <button 
                                                    className="btn btn-outline-danger btn-sm rounded-circle"
                                                    onClick={() => handleDelete(el.id)}
                                                    title="Delete Student"
                                                    style={{ width: '35px', height: '35px' }}
                                                >
                                                    <FaTrash size={12}/>
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="8" className="text-center py-5 text-muted">
                                                Start by searching for a batch or student above.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Inline Styles for extra fancy touches */}
            <style jsx="true">{`
                .batch-card {
                    border: none;
                    border-radius: 20px;
                    transition: all 0.3s ease;
                    background: white;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
                    cursor: pointer;
                    overflow: hidden;
                }
                .batch-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 30px rgba(108, 99, 255, 0.2);
                }
                .icon-bg {
                    width: 50px;
                    height: 50px;
                    background: linear-gradient(135deg, #6c63ff, #4834d4);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto;
                }
                .btn-link-custom {
                    color: #6c63ff;
                    font-weight: 600;
                    font-size: 0.9rem;
                    text-decoration: none;
                }
                .custom-input-lg, .custom-select-lg {
                    height: 50px;
                    border-radius: 10px;
                    border: 1px solid #eee;
                    background-color: #f9f9f9;
                }
                .custom-input-lg:focus, .custom-select-lg:focus {
                    background-color: #fff;
                    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
                    border-color: #6c63ff;
                }
            `}</style>
        </div>
    );
}

// JS Object Styles for dynamic/cleanup
const styles = {
    pageContainer: {
        backgroundColor: '#f4f6f9',
        minHeight: '100vh',
        fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    headerTitle: {
        fontWeight: '700',
        color: '#2d3436',
        letterSpacing: '-1px'
    },
    input: {
        fontSize: '15px'
    },
    searchBtn: {
        height: '50px',
        borderRadius: '10px',
        backgroundColor: '#6c63ff',
        borderColor: '#6c63ff',
        fontWeight: '600',
        boxShadow: '0 4px 15px rgba(108, 99, 255, 0.3)'
    },
    tableHead: {
        backgroundColor: '#2d3436',
        color: '#ffffff',
    }
};

export default Student;