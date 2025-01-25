"use client";
import Link from "next/link";
export default function MainButton() {

    return (
        <div className="flex w-full h-64 flex-row z-50 relative">
            <div className="ml-5 mr-5 w-1/3 flex flex-col rounded-3xl border-2 border-gray-300 hover:border-black hover:-translate-y-2 p-2">
                <Link href="/sync">
                    <div className="flex flex-row">
                        <p className="mt-4 ml-4 text-4xl text-black">
                        Tarot Reading
                        </p>
                        <p className="mt-6 ml-4 text-lg text-gray-600 hover:text-black">

                        </p>
                    </div>
                    <p className="mt-4 ml-4 text-xl text-gray-600">
                        Explore your inner world through mystical tarot cards. Let ancient wisdom guide you to find life answers and receive spiritual enlightenment.
                    </p>
                </Link>
            </div>


            <div className="ml-5 mr-5 w-1/3 flex flex-col rounded-3xl border-2 border-gray-300 hover:border-black hover:-translate-y-2 p-2">
               <div className="flex flex-row">
                    <p className="mt-4 ml-4 text-4xl text-black">
                       Daily Check-in
                    </p>
                    <p className="mt-6 ml-4 text-lg text-gray-600 hover:text-black">
                        {/* Your Premier Analytics Solution. */}
                    </p>
                </div>
                <p className="mt-4 ml-4 text-xl text-gray-600">
                    Earn points through daily check-ins and level up with consistent participation. Engage with the community to unlock exclusive privileges and rewards.
                </p>
            </div>


            <div className="ml-5 mr-10 w-1/3 flex flex-col rounded-3xl border-2 border-gray-300 hover:border-black hover:-translate-y-2 p-2">
                <p className="mt-4 ml-4 text-4xl text-black">Coming Soon</p>
                <p className="mt-4 ml-4 text-xl text-gray-600">
                    Stay tuned for more exciting features, including horoscope readings, love compatibility tests, feng shui guidance, and other mystical services.
                </p>
            </div>

        </div>
    );
}
