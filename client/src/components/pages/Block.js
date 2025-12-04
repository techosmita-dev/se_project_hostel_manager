import React, { Component } from 'react';

// Inline Icon
const BuildingIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
);

class Block extends Component {

    onBatchSelect(blockId) {
        this.props.history.push(`/room/${blockId}`);
    }

    render() {
        // Data structure for blocks (easy to expand later)
        const blocks = [
            { id: 'A', color: '#4e73df', label: 'Alpha' },
            { id: 'B', color: '#1cc88a', label: 'Beta' },
            { id: 'C', color: '#36b9cc', label: 'Gamma' },
            { id: 'D', color: '#f6c23e', label: 'Delta' },
        ];

        return (
            <div className="container-fluid bg-light min-vh-100 py-5">
                {/* CSS for hover effects */}
                <style>{`
                    .block-card { transition: all 0.3s ease; cursor: pointer; border-left: 5px solid transparent; }
                    .block-card:hover { transform: translateY(-10px); box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; }
                    /* Dynamic border colors based on block */
                    .block-A { border-left-color: #4e73df; }
                    .block-B { border-left-color: #1cc88a; }
                    .block-C { border-left-color: #36b9cc; }
                    .block-D { border-left-color: #f6c23e; }
                    .block-icon-wrapper { background-color: #f8f9fc; padding: 20px; border-radius: 50%; display: inline-block; margin-bottom: 15px; }
                `}</style>

                <div className="container">
                    
                    {/* Header */}
                    <div className="text-center mb-5">
                        <h2 className="display-6 font-weight-bold text-dark">Select a Hostel Block</h2>
                        <p className="text-muted">Choose a block to manage rooms, cleaning status, and maintenance.</p>
                    </div>

                    {/* Block Grid */}
                    <div className="row justify-content-center">
                        {blocks.map((block) => (
                            <div className="col-xl-3 col-md-6 mb-4" key={block.id}>
                                <div 
                                    className={`card border-0 shadow-sm h-100 py-4 block-card block-${block.id}`}
                                    onClick={() => this.onBatchSelect(block.id)}
                                >
                                    <div className="card-body text-center">
                                        <div className="block-icon-wrapper" style={{ color: block.color }}>
                                            <BuildingIcon />
                                        </div>
                                        <div className="text-xs font-weight-bold text-uppercase mb-1" style={{ color: block.color }}>
                                            Hostel Block
                                        </div>
                                        <div className="h1 mb-2 font-weight-bold text-gray-800">
                                            {block.id}
                                        </div>
                                        <div className="text-muted small">
                                            {block.label} Wing
                                        </div>
                                        <hr className="my-4 w-25 mx-auto" />
                                        <button className="btn btn-sm btn-outline-dark" style={{borderRadius: '20px', fontSize: '0.8rem'}}>
                                            Manage Rooms
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Info */}
                    <div className="row mt-4">
                        <div className="col-12 text-center">
                            <div className="alert alert-light border d-inline-block shadow-sm">
                                <i className="fas fa-info-circle mr-2 text-info"></i>
                                Need to add a new Block? <span className="text-primary" style={{cursor: 'pointer', fontWeight: 'bold'}}>Contact Super Admin</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default Block;