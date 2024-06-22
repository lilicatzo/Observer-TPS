import React, { useState, useEffect, useCallback, useRef } from "react";
import { Chart } from "react-google-charts";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/ElectionData.css";

const colors = {
  "Anies - Muhaimin": "#80B9AD",
  "Prabowo - Gibran": "#83B4FF",
  "Ganjar - Mahfud": "#EE4E4E",
};

const aggregateNationalVotes = (data) => {
  const totalVotes = {
    100025: 0, // Anies - Muhaimin
    100026: 0, // Prabowo - Gibran
    100027: 0, // Ganjar - Mahfud
  };

  if (data && data.table) {
    Object.values(data.table).forEach((province) => {
      totalVotes["100025"] += province["100025"];
      totalVotes["100026"] += province["100026"];
      totalVotes["100027"] += province["100027"];
    });
  }

  return totalVotes;
};

const aggregateVotes = (voteData) => {
  const totalVotes = {
    100025: 0, // Anies - Muhaimin
    100026: 0, // Prabowo - Gibran
    100027: 0, // Ganjar - Mahfud
  };

  if (voteData) {
    Object.values(voteData).forEach((region) => {
      totalVotes["100025"] += region["100025"];
      totalVotes["100026"] += region["100026"];
      totalVotes["100027"] += region["100027"];
    });
  }

  return totalVotes;
};

const ElectionData = () => {
  const [data, setData] = useState(null);
  const [provinceData, setProvinceData] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState({ id: "National", kode: "", nama: "National" });
  const [selectedKabupaten, setSelectedKabupaten] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState("");
  const [selectedKelurahan, setSelectedKelurahan] = useState("");
  const [selectedTPS, setSelectedTPS] = useState(""); 
  const [kabupatenMetadata, setKabupatenMetadata] = useState([]);
  const [kecamatanMetadata, setKecamatanMetadata] = useState([]);
  const [kelurahanMetadata, setKelurahanMetadata] = useState([]);
  const [tpsMetadata, setTpsMetadata] = useState([]);
  const [voteData, setVoteData] = useState({});
  const [pieChartData, setPieChartData] = useState([]);
  const [, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const electionResponse = await fetch("https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp.json");
        const electionData = await electionResponse.json();
        setData(electionData);

        const provinceResponse = await fetch("https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/0.json");
        const provinceData = await provinceResponse.json();
        setProvinceData(provinceData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching initial data.");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchKabupatenData = async () => {
      if (selectedProvince.id !== "National" && selectedProvince.kode) {
        try {
          const response = await fetch(`https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/${selectedProvince.kode}.json`);
          const kabupatenJsonData = await response.json();
          setKabupatenMetadata(kabupatenJsonData);
        } catch (error) {
          console.error("Error fetching wilayah kabupaten data:", error);
          setKabupatenMetadata([]);
          setError("Error fetching Kabupaten data.");
        }
      } else {
        setKabupatenMetadata([]);
      }
    };
    fetchKabupatenData();
  }, [selectedProvince]);

  useEffect(() => {
    const fetchKecamatanData = async () => {
      if (selectedKabupaten && selectedProvince.kode) {
        try {
          const response = await fetch(`https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/${selectedProvince.kode}/${selectedKabupaten}.json`);
          const kecamatanJsonData = await response.json();
          setKecamatanMetadata(kecamatanJsonData);
        } catch (error) {
          console.error("Error fetching wilayah kecamatan data:", error);
          setKecamatanMetadata([]);
          setError("Error fetching Kecamatan data.");
        }
      } else {
        setKecamatanMetadata([]);
      }
    };
    fetchKecamatanData();
  }, [selectedKabupaten]);

  useEffect(() => {
    const fetchKelurahanData = async () => {
      if (selectedKecamatan && selectedProvince.kode && selectedKabupaten) {
        try {
          const response = await fetch(`https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/${selectedProvince.kode}/${selectedKabupaten}/${selectedKecamatan}.json`);
          const kelurahanJsonData = await response.json();
          setKelurahanMetadata(kelurahanJsonData);
        } catch (error) {
          console.error("Error fetching wilayah kelurahan data:", error);
          setKelurahanMetadata([]);
          setError("Error fetching Kelurahan data.");
        }
      } else {
        setKelurahanMetadata([]);
      }
    };
    fetchKelurahanData();
  }, [selectedKecamatan]);

  useEffect(() => {
    const fetchTpsData = async () => {
      if (selectedKelurahan && selectedProvince.kode && selectedKabupaten && selectedKecamatan) {
        try {
          const response = await fetch(`https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/${selectedProvince.kode}/${selectedKabupaten}/${selectedKecamatan}/${selectedKelurahan}.json`);
          const tpsJsonData = await response.json();
          setTpsMetadata(tpsJsonData);
        } catch (error) {
          console.error("Error fetching wilayah tps data:", error);
          setTpsMetadata([]);
          setError("Error fetching TPS data.");
        }
      } else {
        setTpsMetadata([]);
      }
    };
    fetchTpsData();
  }, [selectedKelurahan]);

  useEffect(() => {
    const fetchVoteData = async () => {
      if (selectedProvince.kode) {
        let url = `https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp/${selectedProvince.kode}.json`;
        console.log(url);
        if (selectedKabupaten) {
          url = `https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp/${selectedProvince.kode}/${selectedKabupaten}.json`;
        }
        if (selectedKecamatan) {
          url = `https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp/${selectedProvince.kode}/${selectedKabupaten}/${selectedKecamatan}.json`;
        }
        if (selectedKelurahan) {
          url = `https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp/${selectedProvince.kode}/${selectedKabupaten}/${selectedKecamatan}/${selectedKelurahan}.json`;
        }
        if (selectedTPS) {
          url = `https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp/${selectedProvince.kode}/${selectedKabupaten}/${selectedKecamatan}/${selectedKelurahan}/${selectedTPS}.json`;
        }
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Failed to fetch vote data for ${url}`);
          }
          const voteJsonData = await response.json();
          setVoteData(voteJsonData.table);
        } catch (error) {
          console.error("Error fetching vote data:", error);
          setVoteData({});
          setError("Error fetching vote data.");
        }
      }
    };
    fetchVoteData();
  }, [selectedProvince, selectedKabupaten, selectedKecamatan, selectedKelurahan, selectedTPS]);

  useEffect(() => {
    const updatePieChartData = () => {
      const generatePieChartData = (votes) => [
        ["Candidate", "Votes"],  // Include header row for Google Chart data
        ["Anies - Muhaimin", votes["100025"]],
        ["Prabowo - Gibran", votes["100026"]],
        ["Ganjar - Mahfud", votes["100027"]],
      ];

      let newPieChartData = [];

      switch (true) {
        case selectedProvince.id === "National":
          const nationalVotes = aggregateNationalVotes(data);
          newPieChartData = generatePieChartData(nationalVotes);
          break;

        case selectedTPS && voteData[selectedTPS]:
          const selectedTpsVotes = voteData[selectedTPS];
          newPieChartData = generatePieChartData(selectedTpsVotes);
          break;

        case selectedKelurahan && voteData[selectedKelurahan]:
          const kelurahanVotes = aggregateVotes(voteData[selectedKelurahan]);
          newPieChartData = generatePieChartData(kelurahanVotes);
          break;

        case selectedKecamatan && voteData[selectedKecamatan]:
          const kecamatanVotes = aggregateVotes(voteData[selectedKecamatan]);
          newPieChartData = generatePieChartData(kecamatanVotes);
          break;

        case selectedKabupaten && voteData[selectedKabupaten]:
          const kabupatenVotes = aggregateVotes(voteData[selectedKabupaten]);
          newPieChartData = generatePieChartData(kabupatenVotes);
          break;

        default:
          const provinceVotes = aggregateVotes(voteData);
          newPieChartData = generatePieChartData(provinceVotes);
          break;
      }

      setPieChartData(newPieChartData);
    };

    updatePieChartData();
  }, [selectedProvince, selectedKabupaten, selectedKecamatan, selectedKelurahan, selectedTPS, data, voteData]);

  const handleProvinceChange = (event) => {
    const provinceId = event.target.value;
    const province = provinceData.find(p => p.id.toString() === provinceId);
    if (province) {
      setSelectedProvince({
        id: province.id,
        kode: province.kode,
        nama: province.nama
      });
      setSelectedKabupaten("");
      setSelectedKecamatan("");
      setSelectedKelurahan("");
      setSelectedTPS("");
    } else {
      console.error("Selected province not found in provinceData");
      setError("Selected province not found.");
    }
  };

  const handleKabupatenChange = useCallback((event) => {
    const newKabupatenKode = event.target.value;
    if (newKabupatenKode !== selectedKabupaten) {
      setSelectedKabupaten(newKabupatenKode);
      setSelectedKecamatan("");
      setSelectedKelurahan("");
      setSelectedTPS("");
    }
  }, [selectedKabupaten]);

  const handleKecamatanChange = useCallback((event) => {
    const newKecamatanKode = event.target.value;
    if (newKecamatanKode !== selectedKecamatan) {
      setSelectedKecamatan(newKecamatanKode);
      setSelectedKelurahan("");
      setSelectedTPS("");
    }
  }, [selectedKecamatan]);

  const handleKelurahanChange = useCallback((event) => {
    const newKelurahanKode = event.target.value;
    if (newKelurahanKode !== selectedKelurahan) {
      setSelectedKelurahan(newKelurahanKode);
      setSelectedTPS("");
    }
  }, [selectedKelurahan]);

  const handleTpsChange = useCallback((event) => {
    const newTpsKode = event.target.value;
    if (newTpsKode !== selectedTPS) {
      setSelectedTPS(newTpsKode);
    }
  }, [selectedTPS]);

  if (!data || !provinceData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="election-data-container" style={{ marginTop: "80px" }}>
      <h1 className="text-center">Election Data</h1>
      <div className="form-container">
        <div className="form-group">
          <label htmlFor="provinceSelect">Select Province:</label>
          <select id="provinceSelect" className="form-control" onChange={handleProvinceChange} value={selectedProvince.id || "National"}>
            <option value="National">National</option>
            {provinceData.map((province) => (
              <option key={province.id} value={province.id}>
                {province.nama}
              </option>
            ))}
          </select>
        </div>
        {selectedProvince.id !== "National" && (
          <div className="form-group ml-3">
            <label htmlFor="kabupatenSelect">Select Kabupaten/Kota:</label>
            <select id="kabupatenSelect" className="form-control" onChange={handleKabupatenChange} value={selectedKabupaten}>
              {kabupatenMetadata.map((kabupaten) => (
                <option key={kabupaten.kode} value={kabupaten.kode}>
                  {kabupaten.nama}
                </option>
              ))}
            </select>
          </div>
        )}
        {selectedKabupaten && (
          <div className="form-group ml-3">
            <label htmlFor="kecamatanSelect">Select Kecamatan:</label>
            <select id="kecamatanSelect" className="form-control" onChange={handleKecamatanChange} value={selectedKecamatan}>
              {kecamatanMetadata.map((kecamatan) => (
                <option key={kecamatan.kode} value={kecamatan.kode}>
                  {kecamatan.nama}
                </option>
              ))}
            </select>
          </div>
        )}
        {selectedKecamatan && (
          <div className="form-group ml-3">
            <label htmlFor="kelurahanSelect">Select Kelurahan/Desa:</label>
            <select id="kelurahanSelect" className="form-control" onChange={handleKelurahanChange} value={selectedKelurahan}>
              {kelurahanMetadata.map((kelurahan) => (
                <option key={kelurahan.kode} value={kelurahan.kode}>
                  {kelurahan.nama}
                </option>
              ))}
            </select>
          </div>
        )}
        {selectedKelurahan && (
          <div className="form-group ml-3">
            <label htmlFor="tpsSelect">Select TPS:</label>
            <select id="tpsSelect" className="form-control" onChange={handleTpsChange} value={selectedTPS}>
              {tpsMetadata.map((tps) => (
                <option key={tps.kode} value={tps.kode}>
                  {tps.nama}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="chart-container">
        <h2>{selectedProvince.nama} Vote Distribution</h2>
        {pieChartData.length > 1 ? (
          <Chart
            chartType="PieChart"
            data={pieChartData}
            width={"100%"}
            height={"500px"} // Increase the height for a bigger chart
            options={{
              colors: Object.values(colors),
              chartArea: { width: "100%", height: "79%" }, // Increase the height of the chart area
              backgroundColor: "transparent", // Make the background transparent
              legend: { position: "none" }, // Position the legend as needed
              pieSliceText: "percentage",
              pieSliceTextStyle: {
                fontSize: 18,
                bold:true,
                color:"black",  
              },
            }}
          />
        ) : (
          <p>Data not Found</p>
        )}
      </div>
      {pieChartData.length > 1 ? (
        <div className="vote-details">
          {pieChartData.slice(1).map(([id, value], index) => (
            <div key={id} className="vote-item">
              <div className="color-box" style={{ backgroundColor: Object.values(colors)[index] }}></div>
              <p className="vote-text">{id}: {value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ElectionData;
 

  
