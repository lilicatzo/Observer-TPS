import React, { useState, useEffect } from "react";
import { PieChart } from "@mui/x-charts";
import "bootstrap/dist/css/bootstrap.min.css";

const colors = {
  "Anies - Muhaimin": "green",
  "Prabowo - Gibran": "skyblue",
  "Ganjar - Mahfud": "red",
};

const ElectionData = () => {
  const [data, setData] = useState(null);
  const [provinceData, setProvinceData] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState("National");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp.json");
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchProvinceData = async () => {
      try {
        const response = await fetch("https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/0.json");
        const provinceJsonData = await response.json();
        setProvinceData(provinceJsonData);
      } catch (error) {
        console.error("Error fetching province data:", error);
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
    return province ? province.nama : "Unknown Province";
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

  const aggregateNationalVotes = () => {
    const totalVotes = {
      100025: 0, // Anies - Muhaimin
      100026: 0, // Prabowo - Gibran
      100027: 0, // Ganjar - Mahfud
    };

    // Sum up the votes for each candidate across all provinces
    Object.values(data.table).forEach((province) => {
      totalVotes["100025"] += province["100025"];
      totalVotes["100026"] += province["100026"];
      totalVotes["100027"] += province["100027"];
    });

    return totalVotes;
  };

  const renderCandidateChart = () => {
    let pieChartData;

    if (selectedProvince && selectedProvince !== "National") {
      const totalVotes = {
        "Anies - Muhaimin": 0,
        "Prabowo - Gibran": 0,
        "Ganjar - Mahfud": 0,
      };

      getCandidateDataById("100025")
        .filter(({ provinceName }) => provinceName === selectedProvince)
        .forEach(({ candidateValue }) => {
          totalVotes["Anies - Muhaimin"] += candidateValue;
        });

      getCandidateDataById("100026")
        .filter(({ provinceName }) => provinceName === selectedProvince)
        .forEach(({ candidateValue }) => {
          totalVotes["Prabowo - Gibran"] += candidateValue;
        });

      getCandidateDataById("100027")
        .filter(({ provinceName }) => provinceName === selectedProvince)
        .forEach(({ candidateValue }) => {
          totalVotes["Ganjar - Mahfud"] += candidateValue;
        });

      pieChartData = Object.entries(totalVotes).map(([candidateName, votes]) => ({
        id: candidateName,
        value: votes,
        color: colors[candidateName],
      }));
    } else {
      const nationalVotes = aggregateNationalVotes();
      pieChartData = [
        { id: "Anies - Muhaimin", value: nationalVotes["100025"], color: colors["Anies - Muhaimin"] },
        { id: "Prabowo - Gibran", value: nationalVotes["100026"], color: colors["Prabowo - Gibran"] },
        { id: "Ganjar - Mahfud", value: nationalVotes["100027"], color: colors["Ganjar - Mahfud"] },
      ];
    }

    return (
      <div className="d-flex flex-column align-items-center">
        <h2>{selectedProvince ? `${selectedProvince} Vote Distribution` : "National Vote Distribution"}</h2>
        <PieChart colors={["green", "skyblue", "red"]} series={[{ data: pieChartData }]} width={600} height={400} />
        <div className="mt-3 d-flex flex-column align-items-center">
          {pieChartData.map(({ id, value, color }) => (
            <div key={id} className="d-flex align-items-center">
              <div style={{ width: "20px", height: "20px", backgroundColor: color, marginRight: "5px" }}></div>
              <p style={{ fontWeight: "bold", color: "black", margin: 0 }}>
                {id}: {value}
              </p>
            </div>
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
          <select id="provinceSelect" className="form-control" onChange={handleProvinceChange} value={selectedProvince}>
            <option value="National">National</option>
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
