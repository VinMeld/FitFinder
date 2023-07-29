import React from 'react'
type SelectUserTypeProps = {
  setTab: React.Dispatch<React.SetStateAction<number>>;
}

const SelectUserType: React.FC<SelectUserTypeProps> = ({ setTab }) => {
  return (
    <>
        <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Choose Account</h3>
        <div onClick={() => setTab(2)} className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">User</h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">If you intend to browse for a trainer!</p>
        </div>

        <div onClick={() => setTab(3)} className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Trainer💪</h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">If you intend to market yourself!</p>
        </div>

    </>
  )
}
export default SelectUserType;
