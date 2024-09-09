import axios from 'axios';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';

// Styles for the components
const Container = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  text-align: center;
  font-family: Arial, sans-serif;
  max-width: 100vw;
  overflow-x: hidden;
`;

const Heading = styled.h1`
  font-size: 2rem;
  color: #333;
`;

const Paragraph = styled.p`
  font-size: 1rem;
  color: #666;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-bottom: 20px;
`;

const ListItem = styled.p`
  font-size: 1rem;
  color: #444;
`;

const ChartContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TextContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 10px;
`;

const SubHeading = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-top: 20px;
  margin-bottom: 10px;
`;

// Dynamic import for the chart component
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Country() {
  const router = useRouter();
  const { code } = router.query;
  const [countryInfo, setCountryInfo] = useState(null);
  const [populationData, setPopulationData] = useState(null);
  const [flagImage, setFlagImage] = useState(null);

  useEffect(() => {
    if (code) {
      // Fetch country information
      axios.get(`http://localhost:3001/country/${code}`)
        .then(response => {
          const data = response.data;
          setCountryInfo({
            commonName: data.commonName,
            officialName: data.officialName,
            countryCode: data.countryCode,
            region: data.region,
            borders: data.borders,
          });
          setPopulationData(data.population); 
          setFlagImage(data.flag); 
        })
        .catch(error => {
          console.error('Error fetching country information', error);
        });
    }
  }, [code]);

  if (!countryInfo) return <div>Loading...</div>;

  // Prepare data for the chart
  const chartOptions = {
    chart: {
      id: 'population-chart'
    },
    xaxis: {
      categories: populationData ? populationData.map(entry => entry.year) : []
    },
    yaxis: {
      title: {
        text: 'Population'
      }
    }
  };

  const chartSeries = [{
    name: 'Population',
    data: populationData ? populationData.map(entry => entry.value) : []
  }];

  return (
    <Container>
      <TextContainer>
        <List>
          <Heading>{countryInfo.commonName || 'Common name not available'}</Heading>
          <Paragraph><b>Official Name:</b> {countryInfo.officialName || 'Official name not available'}</Paragraph>
          <Paragraph><b>Country Code:</b> {countryInfo.countryCode || 'Code not available'}</Paragraph>
          <Paragraph><b>Region:</b> {countryInfo.region || 'Region not available'}</Paragraph>

          <Paragraph>
            {flagImage ? (
              <img src={flagImage} alt={`${countryInfo.commonName} flag`} style={{ maxWidth: '100px', height: 'auto' }} />
            ) : (
              'Flag not available'
            )}
          </Paragraph>
        </List>

        <h2>Neighboring Countries</h2>
        {Array.isArray(countryInfo.borders) && countryInfo.borders.length > 0 ? (
          countryInfo.borders.map((border, index) => (
            <ListItem key={index}>
              {border || 'Neighboring country name not available'}
            </ListItem>
          ))
        ) : (
          <ListItem>No neighboring countries</ListItem>
        )}
      </TextContainer>

      <ChartContainer>
        <SubHeading>Population</SubHeading>
        {populationData ? (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="line"
            height={400}
          />
        ) : (
          <Paragraph>Population data not available</Paragraph>
        )}
      </ChartContainer>
    </Container>
  );
}
