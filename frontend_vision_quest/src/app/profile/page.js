// import { useSession } from 'next-auth/react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

function Profile() {
//   const { data: session } = useSession();

  return (
    <>
        <div className="flex flex-col h-screen justify-between">
            <Header />
            <main className="container mb-auto mx-auto mt-8">
                <div className="bg-gray-100 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
                    {/* {session ? ( */}
                    <div>
                        <p className="mb-2">
                            <span className="font-semibold">Username:</span> user
                        </p>
                        <p className="mb-2">
                            <span className="font-semibold">Email:</span> abc@g.com
                        </p>
                        <p className="mb-2">
                            <span className="font-semibold">First Name:</span> name1
                        </p>
                        <p>
                            <span className="font-semibold">Last Name:</span> name2
                        </p>
                        {/* <p>
                            <span className="font-semibold">Last Name:</span> {session.user.last_name}
                        </p> */}
                    </div>
                    {/* ) : (
                    <p>Please sign in to view your profile.</p>
                    )} */}
                </div>
            </main>
            <Footer />
        </div>
    </>
  );
}

export default Profile;
