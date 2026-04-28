import React from "react";

const StatCard = ({ stats }) => {
    return (
    <div className="stat-card">
        <div className="stat-header">
            <span className="stat-icon">{stats.icon}</span>
            <span className="stat-title">{stats.title}</span>
    </div>
    <div className="stat-value">
        {stats.statistics.value}
        <span className="stat-unit">{stats.statistics.unit}</span>
    </div>
</div>
    );
};

export default StatCard;