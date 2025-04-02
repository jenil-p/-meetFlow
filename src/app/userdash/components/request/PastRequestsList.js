import React from 'react';

const PastRequestsList = ({ permissions }) => {
  return (
    <div className="mb-10">
      {permissions.length === 0 ? (
        <p className="text-gray-600">No past requests found.</p>
      ) : (
        <div className="flex flex-col justify-start items-center gap-4 overflow-y-auto max-h-[500px] pb-20">
          {permissions.map((permission) => (
            <div key={permission._id} className="bg-white p-4 w-full rounded-lg shadow-md">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{permission.title}</h3>
                <p className="text-sm text-gray-600">Session: {permission.session?.title}</p>
                <p className="text-sm text-gray-600">Status: {permission.status}</p>
                <p className="text-sm text-gray-600">
                  Requested: {new Date(permission.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PastRequestsList;