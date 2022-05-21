import { faGear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SearchLayout from '../../components/layout/SearchLayout'
import Favorite from '../../components/Profile/Favorite'

export default function Profile() {
    return (
        <SearchLayout>
            <main className="px-44 py-10">
                <div className='flex justify-between items-center'>
                    <h1 className='text-white font-bold text-4xl'>Welcome Anton!</h1>
                    {/* 
                    TODO:Check if it is needed
                    <h2>Need to verify your </h2> */}
                    <div className='flex items-center'>
                        <FontAwesomeIcon icon={faGear} className="pr-2 cursor-pointer" style={{color:'#616e7e'}}/>
                        <p className="text-large font-semibold cursor-pointer" style={{color:'#616e7e'}}>Account Settings</p>
                    </div>
                </div>
                <div className='pt-24'>
                    <h1 className='text-white font-bold text-3xl'>Favorite Games</h1>
                    <div className='mt-6'>
                        {/* TODO: */}
                        <Favorite />
                    </div>
                </div>

            </main>
        </SearchLayout>
    )
}