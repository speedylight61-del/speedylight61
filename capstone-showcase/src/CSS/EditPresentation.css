import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Map } from "lucide-react";

const EditPresentation: React.FC = () => {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const navigate = useNavigate();

  const savedImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const map = reader.result as string;
        localStorage.setItem("savedImage", map);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitInfo = () => {
    localStorage.setItem("savedTime", time);
    localStorage.setItem("savedDate", date);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Capstone Presentation
          </h1>
          <p className="text-gray-600">Update presentation details</p>
        </div>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="userInputTime"
              className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
            >
              <Clock className="w-4 h-4 mr-2" />
              Presentation Time
            </label>
            <input
              type="time"
              id="userInputTime"
              name="userInputTime"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon-500 focus:ring-maroon-500 sm:text-sm p-2 border"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="userInputDate"
              className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Presentation Date
            </label>
            <input
              type="date"
              id="userInputDate"
              name="userInputDate"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon-500 focus:ring-maroon-500 sm:text-sm p-2 border"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Map className="w-4 h-4 mr-2" />
              Venue Map
            </label>
            <div className="mt-1 flex items-center">
              <label className="block w-full">
                <span className="sr-only">Choose map image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={savedImage}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-maroon-50 file:text-maroon-700
                    hover:file:bg-maroon-100
                    cursor-pointer"
                />
              </label>
            </div>
            {fileName && (
              <p className="mt-2 text-sm text-gray-500">Selected: {fileName}</p>
            )}
          </div>

          <button
            onClick={submitInfo}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-maroon-600 hover:bg-maroon-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maroon-500 transition-colors duration-200"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPresentation;