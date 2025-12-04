import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentUser } from "../../actions/authActions";

// Asset Imports
const student = require("../../img/student.jpg");
const staff = require("../../img/staff.jpeg");
const bedRoom = require("../../img/bedroom.jpeg");
const adminLogo = require("../../img/hostel.jpg");

// Inline Icons
const ArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);

class Dashboard extends Component {
  componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }
  }

  render() {
    const { user } = this.props.auth;

    // Card Component to reduce repetition
    const DashboardCard = ({ img, title, desc, link, linkText }) => (
      <div className="col-lg-4 col-md-6 mb-4">
        <div className="card h-100 border-0 shadow-sm hover-card" style={{ borderRadius: '15px', overflow: 'hidden', transition: 'all 0.3s ease' }}>
          <div className="img-wrapper" style={{ height: '220px', overflow: 'hidden' }}>
            <img 
              src={img} 
              alt={title} 
              className="card-img-top"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
            />
          </div>
          <div className="card-body d-flex flex-column p-4">
            <h5 className="card-title font-weight-bold text-dark mb-2">{title}</h5>
            <p className="card-text text-muted mb-4 small">{desc}</p>
            <a href={link} className="btn btn-outline-primary btn-block mt-auto font-weight-bold" style={{ borderRadius: '25px' }}>
              {linkText} <span className="ml-2"><ArrowRight /></span>
            </a>
          </div>
        </div>
      </div>
    );

    return (
      <div className="container-fluid bg-light min-vh-100 py-5">
        
        {/* CSS for hover effects (scoped to this component) */}
        <style>{`
          .hover-card:hover { transform: translateY(-10px); box-shadow: 0 1rem 3rem rgba(0,0,0,.175)!important; }
          .hover-card:hover .img-wrapper img { transform: scale(1.1); }
          .welcome-banner { background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%); }
        `}</style>

        <div className="container">
          
          {/* Welcome / Hero Section */}
          <div className="row mb-5">
            <div className="col-12">
              <div className="card border-0 shadow-sm welcome-banner" style={{ borderRadius: '20px' }}>
                <div className="card-body p-4 p-md-5 d-flex align-items-center flex-column flex-md-row">
                  <div className="mr-md-4 mb-3 mb-md-0 text-center">
                    <img
                      src={adminLogo}
                      alt="Hostel Admin"
                      className="shadow-sm border"
                      style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", border: '4px solid white' }}
                    />
                  </div>
                  <div className="text-center text-md-left">
                    <h2 className="display-6 font-weight-bold text-dark mb-1">Welcome back, <span className="text-primary">{user.name}!</span></h2>
                    <p className="text-muted lead mb-0">Hostel Management Admin Dashboard</p>
                    <p className="text-muted small mt-2">Manage your students, staff, and room maintenance efficiently from this central hub.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Section */}
          <h5 className="text-muted text-uppercase font-weight-bold mb-4 ml-1" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Quick Access</h5>
          
          <div className="row">
            
            {/* Student Card */}
            <DashboardCard 
              img={student}
              title="Student Management"
              desc="Register new students, allot rooms, manage attendance, and update student profiles."
              link="/student"
              linkText="Manage Students"
            />

            {/* Room/Maintenance Card */}
            <DashboardCard 
              img={bedRoom}
              title="Room Maintenance"
              desc="Track room availability, request cleaning services, and manage repair status logs."
              link="/block"
              linkText="Check Rooms"
            />

            {/* Staff Card */}
            <DashboardCard 
              img={staff}
              title="Staff Directory"
              desc="View staff details, manage contact information, and oversee hostel employee records."
              link="/staff"
              linkText="Manage Staff"
            />

          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  // getCurrentUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getCurrentUser }
)(Dashboard);