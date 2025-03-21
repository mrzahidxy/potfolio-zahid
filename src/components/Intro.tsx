import Image from "next/image";

function Intro() {
  return (
    <div className="container h-full flex flex-col lg:flex-row items-center p-4">
      <div className="flex-1 flex flex-col gap-4 max-w-2xl">
        <span className="text-xl md:text-3xl">Hello, This is</span>
        <h1 className="text-4xl md:text-6xl font-bold">Zahid Hasan</h1>
        <div className="h-12 overflow-hidden">
          <div className="flex flex-col animate-move text-xl md:text-4xl font-bold text-blue-500">
            <div className="h-12">Software Engineer</div>
            <div className="h-12">Full-Stack Developer</div>
            <div className="h-12">Tech Blogger</div>
            <div className="h-12">Videographer</div>
          </div>
        </div>
        <p className="w-5/6 text-lg text-justify">
        Software Engineer with 3 years of experience in full-stack development, specializing in React.js, Next.js, and Node.js. Passionate about building fast, user-centric applications with seamless API integration and optimized performance.
        </p>
      </div>

      <div className="flex-1">
        <Image
          src="/image/hero-image.png"
          alt=""
          layout="responsive" // Adjusted layout property
          width={300} // Adjusted width for small screens
          height={300} // Adjusted height for small screens
          className="w-full h-auto md:h-full md:w-auto"
        />
      </div>
    </div>
  );
}

export default Intro;
