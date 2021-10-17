import React from "react";
import Chart from 'chart.js/auto';

const MyChart = ({data}) => {
    const canvasRef = React.useRef();

    const config = {
        type: 'doughnut',
        data: data,
        responsive: true,
        options: {showLines: false, maintainAspectRatio: false}  
    };

    React.useEffect(() => {
        let chart = new Chart(canvasRef.current, config);

        return () => chart.destroy();
    }, [data]);

    return (<div className="right-area__chart" style={{minHeight: "60vh"}}>
                <canvas ref={canvasRef} id="myChart"></canvas>
            </div>)
};

export default MyChart;