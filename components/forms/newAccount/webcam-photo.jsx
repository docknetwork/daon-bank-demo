import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from 'components/ui/form';
import Image from 'next/image';
import WebCamModal from './webcam-modal';

/**
 * @description Form Field for user web cam photo
 * @param {*} control  react hook form controller
 * @memberof FormFieldGovId
 * @returns React.FC Form Field
 */
const WebCamPhoto = ({ control, isCaptureCompleted, setIsCaptureCompleted, gif, capturedImage, placeholder, buttonTxt }) => (
    <div className="p-4 bg-neutral-50 rounded-lg h-80 xl:h-3/6">
        <FormField
            control={control}
            name="webcamPic"
            render={({ field }) => (
                <FormItem className="relative h-full">
                    <div className='flex items-center justify-between'>
                        <div>
                            <FormLabel className="font-semibold">Take a webcam photo for KYC check</FormLabel>
                        </div>
                        <div>
                            <Image src="/DaonLogo-FullColor.png" alt='id_clarity' width={87} height={24} />
                        </div>
                    </div>
                    <FormControl>
                        {isCaptureCompleted ? (
                            <div className='grid place-items-center '>
                                <Image src={capturedImage} alt='webcam_oval' width={114} height={198} />
                            </div>
                        ) : (
                            <div className='grid justify-items-center gap-4 pt-2 xl:pt-16'>
                                <Image src={placeholder} alt='background_replace' width={168} height={168} />
                                <WebCamModal
                                    isCaptureCompleted={isCaptureCompleted}
                                    setIsCaptureCompleted={setIsCaptureCompleted}
                                    gif={gif}
                                    buttonTxt={buttonTxt}
                                />
                            </div>
                        )}
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />
    </div>
);

export default WebCamPhoto;
