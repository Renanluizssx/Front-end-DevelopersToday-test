import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
  padding: 20px;
  background-color: #f0f0f0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100vh;
  font-family:Arial;
`;

const Heading = styled.h1`
  font-size: 28px;
  color: #333;
`;

const SubHeading = styled.h2`
  font-size: 24px;
  color: #555;
  text-align: center;
`;

const Paragraph = styled.p`
  font-size: 18px;
  color: #666;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-bottom: 50%;
`;

const ListItem = styled.p   `
  font-size: 18px;
  color: #444;
`;

// Container for chart and text side by side
const ChartContainer = styled.div`
  min-width: 900px; /* Adjust as needed */
  max-width: 1400px; /* Adjust as needed */
  padding: 20px;
  background-color: #ffffff; /* Optional background color */
  border-radius: 8px; /* Optional rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Optional shadow */
`;

const TextContainer = styled.div`
  min-width: 300px; /* Adjust as needed */
  max-width: 600px; /* Adjust as needed */
`;

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Country() {
  const router = useRouter();
  const { code } = router.query;
  const [countryInfo, setCountryInfo] = useState(null);

  useEffect(() => {
    if (code) {
      axios.get(`http://localhost:3001/country/${code}`)
        .then(response => {
          setCountryInfo(response.data);
        })
        .catch(error => console.error('Error fetching country information', error));
    }
  }, [code]);

  if (!countryInfo) return <div>Loading...</div>;

  return (
    <Container>
      <TextContainer>
        <List>
          <Heading>{countryInfo.commonName || 'Common name not available'}</Heading>
          <Paragraph><b>Official name:</b> {countryInfo.officialName || 'Official name not available'}</Paragraph>
          <Paragraph><b>Country code: </b>{countryInfo.countryCode || 'Code not available'}</Paragraph>
          <Paragraph><b>Region:</b> {countryInfo.region || 'Region not available'}</Paragraph>
        </List>
        <h2>Bordering Countries</h2>
        {Array.isArray(countryInfo.borders) && countryInfo.borders.length > 0 ? (
          countryInfo.borders.map((border, index) => (
            <ListItem key={index}>
              {border.commonName || 'Bordering country name not available'}
            </ListItem>
          ))
        ) : (
          <ListItem>No bordering countries</ListItem>
        )}
      </TextContainer>

      <ChartContainer>
        <SubHeading>Population Over Time</SubHeading>
        {countryInfo.population && countryInfo.population.length > 0 ? (
          <Chart
            options={{
              chart: { id: 'population-chart' },
              xaxis: { categories: countryInfo.population.map(p => p.year) }
            }}
            series={[{ name: 'Population', data: countryInfo.population.map(p => p.value) }]}
            type="line"
          />
        ) : (
          <Paragraph>No population data</Paragraph>
        )}
      </ChartContainer>
    </Container>
  );
}
