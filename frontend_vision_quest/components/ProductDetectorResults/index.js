import Link from "next/link";

export const ProductDetectorResults = ({ results }) => (
    <div className="p-6 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Nike Shoe Detection Results</h2>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Product Name</th>
            <th className="px-4 py-2">Confidence Score</th>
            <th className="px-4 py-2">Brand Name</th>
            <th className="px-4 py-2">Pricing</th>
            <th className="px-4 py-2">Link</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td className="px-4 py-2">{result.product_name}</td>
              <td className="px-4 py-2">{result.confidence_score}</td>
              <td className="px-4 py-2">{result.brandName}</td>
              <td className="px-4 py-2">{result.pricing}</td>
              <td className="px-4 py-2"><Link href={result.link}target="_blank">{result.link}</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
);