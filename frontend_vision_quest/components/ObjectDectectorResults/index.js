import React from 'react';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';

export const ObjectDetectorResults = ({ results }) => (
  <div className="p-6 border border-gray-300 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold mb-4">Object Detector Results</h2>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Object Class</TableCell>
            <TableCell>Confidence Score</TableCell>
            <TableCell>Remarks</TableCell>
            <TableCell>Bounding boxes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results?.map((result, index) => (
            <TableRow key={index}>
              <TableCell>{result.object_class}</TableCell>
              <TableCell>{result.confidence_score}</TableCell>
              <TableCell>{result.remarks}</TableCell>
              <TableCell>{result.bbox.join(', ')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);


export const ImageDetails = ({ name, size }) => (
    <div className="flex flex-col">
      <h2 className="text-lg font-semibold">Image Details</h2>
      <p className="text-gray-500">Image Name: {name}</p>
      <p className="text-gray-500">Image Size: {size}</p>
    </div>
  );