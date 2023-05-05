import { FloppyDisk, Minus, Shuffle } from "phosphor-react";
import { WheelOptionModel } from "../model/WheelOptionModel";
import { DeleteAllOptions } from "./DeleteAllOptions";
import { ImportFormDropzone } from "./ImportFormDropzone";
import { api } from "../utils/api";

interface OptionsHeaderProps {
  isModalOpen: boolean;
  wheelOptions: WheelOptionModel[];
  handleWheelOptions: (options: WheelOptionModel[]) => void;
  handleOptionsModal: (state: boolean) => void;
}

export function OptionsHeader({ isModalOpen, wheelOptions, handleWheelOptions, handleOptionsModal }: OptionsHeaderProps) {
  function handleOptionsSaveFile() {
    const now = new Date;
    const saveOptionsData = {
      name: now.getTime(),
      options: wheelOptions
    }
    api
    .post("/export", saveOptionsData, { responseType: "blob" })
    .then((response) => response.data)
    .then((data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${saveOptionsData.name}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
  
  function handleShuffleOptions() {
    const rearrengedOptions = wheelOptions;
    for(let i = rearrengedOptions.length - 1; i > 0; i--) {
      const toChange = Math.floor(Math.random() * (i + 1));
      [rearrengedOptions[i], rearrengedOptions[toChange]] = [rearrengedOptions[toChange], rearrengedOptions[i]]
    }

    handleWheelOptions(rearrengedOptions);
  }

  return (
    <header className="w-full flex justify-between items-start">
      <b className="text-white text-xl">Options</b>
      <div>
        <button onClick={() => handleShuffleOptions()}>
          <Shuffle size={20} weight="bold" className='text-white mr-4' />
        </button>
        <ImportFormDropzone handleWheelOptions={handleWheelOptions} isModalOpen={isModalOpen} />
        <button disabled={wheelOptions.length ? false : true} onClick={() => handleOptionsSaveFile()}>
          <FloppyDisk size={20} weight="bold" className={`text-white mr-4 ${
            wheelOptions.length ? 'opacity-100' : 'opacity-30'
          }`} />
        </button>
        <DeleteAllOptions wheelOptions={wheelOptions} handleWheelOptions={handleWheelOptions} />
        <button onClick={() => handleOptionsModal(false)}>
          <Minus size={20} weight="bold" className="text-white" />
        </button>
      </div>
    </header>
  )
}