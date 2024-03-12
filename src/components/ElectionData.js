import React, { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts';
import 'bootstrap/dist/css/bootstrap.min.css';

const colors = {
    'Anies - Muhaimin': 'green',
    'Prabowo - Gibran': 'skyblue',
    'Ganjar - Mahfud': 'red',
};

const ElectionData = () => {
    const [data, setData] = useState(null);
    const [provinceData, setProvinceData] = useState(null);
    const [selectedProvince, setSelectedProvince] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp.json');
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchProvinceData = async () => {
            try {
                const response = await fetch('https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/0.json');
                const provinceJsonData = await response.json();
                setProvinceData(provinceJsonData);
            } catch (error) {
                console.error('Error fetching province data:', error);
            }
        };

        fetchData();
        fetchProvinceData();
    }, []);

    if (!data || !provinceData) {
        return <div>Loading...</div>;
    }

    const getProvinceNameByKode = (provinceKode) => {
        const province = provinceData.find((item) => item.kode === provinceKode);
        return province ? province.nama : 'Unknown Province';
    };

    const getCandidateDataById = (candidateId) => {
        return Object.entries(data.table).map(([provinceId, candidatesData]) => ({
            provinceName: getProvinceNameByKode(provinceId),
            candidateValue: candidatesData[candidateId],
        }));
    };

    const handleProvinceChange = (event) => {
        setSelectedProvince(event.target.value);
    };

    const renderCandidateChart = () => {
        if (!selectedProvince) {
            return null;
        }

        const totalVotes = {
            'Anies - Muhaimin': 0,
            'Prabowo - Gibran': 0,
            'Ganjar - Mahfud': 0,
        };

        getCandidateDataById(100025)
            .filter(({ provinceName }) => provinceName === selectedProvince)
            .forEach(({ candidateValue }) => {
                totalVotes['Anies - Muhaimin'] += candidateValue;
            });

        getCandidateDataById(100026)
            .filter(({ provinceName }) => provinceName === selectedProvince)
            .forEach(({ candidateValue }) => {
                totalVotes['Prabowo - Gibran'] += candidateValue;
            });

        getCandidateDataById(100027)
            .filter(({ provinceName }) => provinceName === selectedProvince)
            .forEach(({ candidateValue }) => {
                totalVotes['Ganjar - Mahfud'] += candidateValue;
            });

        const pieChartData = Object.entries(totalVotes).map(([candidateName, votes]) => ({
            id: candidateName,
            value: votes,
            label: `${candidateName}: ${votes}`,
            color: colors[candidateName],
        }));

        return (
            <div className="d-flex flex-column align-items-center">
                <h2>{selectedProvince} Vote Distribution</h2>
                <PieChart
                    colors={['red', 'blue', 'green']}
                    series={[{ data: pieChartData.map(({ value, color }) => ({ value, color })) }]}
                    width={600}
                    height={400}
                    labelType="none"
                />
                <div className="mt-3">
                    {pieChartData.map(({ id, value }) => (
                        <p key={id} style={{ fontWeight: 'bold' }}>
                            {id}: {value}
                        </p>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center">Election Data</h1>
            <div className="d-flex justify-content-center">
                <div className="form-group">
                    <label htmlFor="provinceSelect">Select Province:</label>
                    <select
                        id="provinceSelect"
                        className="form-control"
                        onChange={handleProvinceChange}
                        value={selectedProvince || ''}
                    >
                        <option value="">All Provinces</option>
                        {provinceData.map((province) => (
                            <option key={province.kode} value={province.nama}>
                                {province.nama}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {renderCandidateChart()}
        </div>
    );
};

export default ElectionData;
