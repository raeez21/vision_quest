import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const imageUrls = [
    { url: 'image_url_1.jpg', caption: 'Image 1' },
    { url: 'image_url_2.jpg', caption: 'Image 2' },
    { url: 'image_url_3.jpg', caption: 'Image 3' },
    { url: 'image_url_4.jpg', caption: 'Image 4' },
    { url: 'image_url_5.jpg', caption: 'Image 5' },
  ];

export default function Page() {
    return (
      <>
        <div className="flex flex-col h-screen justify-between">
            <Header />
            <main className="container mb-auto mx-auto mt-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-semibold mb-4">Dashboard</h2>
                    <div className="flex flex-row justify-end items-center space-x-10">
                        <span className="text-gray-700">Sort by:</span>
                        <div>
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="sort" value="date" className="form-radio" />
                                <span>Date</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="sort" value="name" className="form-radio" />
                                <span>Name</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="sort" value="size" className="form-radio" />
                                <span>Size</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="mb-8">
                    <div className="pt-10 flex flex-col items-start space-y-6">
                        <div>
                            <h3 className="text-2xl font-semibold mb-2">Last Week</h3>
                            <div className="flex space-x-4 items-center">
                                {imageUrls.map((image, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col items-center"
                                    >
                                        <div
                                            className="flex-none w-56 h-48 bg-gray-300 rounded-xl"
                                            style={{
                                                backgroundImage: `url(${image.url})`,
                                                backgroundSize: 'cover',
                                            }}
                                        ></div>
                                        <p className="mt-2 text-sm">{image.caption}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold mb-2">Last Month</h3>
                            <div className="flex space-x-4 items-center">
                                {imageUrls.map((image, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col items-center"
                                    >
                                        <div
                                            className="flex-none w-56 h-48 bg-gray-300 rounded-xl"
                                            style={{
                                                backgroundImage: `url(${image.url})`,
                                                backgroundSize: 'cover',
                                            }}
                                        ></div>
                                        <p className="mt-2 text-sm">{image.caption}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>

      </>
    )
  }