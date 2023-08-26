export const ObjectDetectorResults = ({ results }) => (
    <div className="p-6 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Object Detector Results</h2>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Object Class</th>
            <th className="px-4 py-2">Confidence Score</th>
            <th className="px-4 py-2">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {results?.map((result, index) => (
            <tr key={index}>
              <td className="px-4 py-2">{result.object_class}</td>
              <td className="px-4 py-2">{result.confidence_score}</td>
              <td className="px-4 py-2">{result.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
);

export const ImageDetails = ({ name, size }) => (
    <div className="flex flex-col">
      <h2 className="text-lg font-semibold">Image Details</h2>
      <p className="text-gray-500">Image Name: {name}</p>
      <p className="text-gray-500">Image Size: {size}</p>
    </div>
  );