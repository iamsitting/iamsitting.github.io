interface LoaderProps {
    message?: string;
}

export default function Loader({ message = "Loading..." }: LoaderProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4CAF50]"></div>
            <div className="text-center">
                <p className="text-[#A3C9A3] text-lg">{message}</p>
                <p className="text-[#A3C9A3] text-sm mt-2">
                    Running on Render's free tier - first request might take up to 50s
                </p>
                <p className="text-[#4CAF50] text-sm mt-1">
                    Feel free to donate to upgrade the hosting! 😉
                </p>
            </div>
        </div>
    );
}