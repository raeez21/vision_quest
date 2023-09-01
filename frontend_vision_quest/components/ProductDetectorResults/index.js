import React from 'react';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';
import Link from 'next/link'; 

export const ProductDetectorResults = ({ results }) => (
  <div className="p-6 border border-gray-300 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-4">Nike Shoe Detection Results</h2>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product Name</TableCell>
            <TableCell>Confidence Score</TableCell>
            <TableCell>Brand Name</TableCell>
            <TableCell>Pricing</TableCell>
            <TableCell>Link</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((result, index) => (
            <TableRow key={index}>
              <TableCell>{result.product_name}</TableCell>
              <TableCell>{result.confidence_score}</TableCell>
              <TableCell>{result.brandName}</TableCell>
              <TableCell>{result.pricing}</TableCell>
              <TableCell>
                <Link href={result.link} target="_blank">
                  {result.link}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);
