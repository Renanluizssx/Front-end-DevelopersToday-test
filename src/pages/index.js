import axios from 'axios';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styles for components
const Container = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  text-align: center;
  font-family:Arial;
`;

const Title = styled.h1`
  font-size: 32px;
  color: #333;
  margin-bottom: 20px;
`;

const CountryList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const CountryItem = styled.li`
  margin: 10px 0;
  font-size: 20px;

  a {
    color: #0070f3;
    text-decoration: none;
    &:hover {
      text-decoration: none;
    }
  }
`;

export default function Home() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/countries')
      .then(response => setCountries(response.data))
      .catch(error => console.error('Error fetching countries', error));
  }, []); 

  return (
    <Container>
      <Title>List of Countries</Title>
      <CountryList>
        {countries.map(country => (
          <CountryItem key={country.countryCode}>
            <Link href={`/country/${country.countryCode}`} passHref>
              {country.name || 'Country name not available'}
            </Link>
          </CountryItem>
        ))}
      </CountryList>
    </Container>
  );
}

