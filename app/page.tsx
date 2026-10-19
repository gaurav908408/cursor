import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 dark:bg-black text-black dark:text-white">
      {/* Hero Section */}
      <section className="w-full max-w-6xl flex flex-col items-center justify-center text-center py-20 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-64px)]">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-fade-in-up">
          Crafting Exceptional Digital Experiences
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl text-zinc-700 dark:text-zinc-300 max-w-3xl mb-10 animate-fade-in-up delay-200">
          Your Partner in Innovative Web Solutions, from Concept to Launch and Beyond.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-400">
          <Link
            href="/projects"
            className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            View Our Projects
          </Link>
          <Link
            href="/contact"
            className="px-8 py-4 border border-blue-600 text-blue-600 text-lg font-semibold rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="w-full max-w-6xl py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 shadow-lg rounded-lg mb-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-black dark:text-white">
          What We Offer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center text-center p-6 bg-zinc-50 dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <Image src="/globe.svg" alt="Web Design" width={64} height={64} className="mb-4 dark:invert" />
            <h3 className="text-2xl font-semibold mb-3 text-black dark:text-white">Web Design</h3>
            <p className="text-zinc-700 dark:text-zinc-300">
              Captivating and intuitive user interfaces tailored to your brand identity.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-zinc-50 dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <Image src="/window.svg" alt="Web Development" width={64} height={64} className="mb-4 dark:invert" />
            <h3 className="text-2xl font-semibold mb-3 text-black dark:text-white">Web Development</h3>
            <p className="text-zinc-700 dark:text-zinc-300">
              High-performance, scalable, and secure websites using the latest technologies.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-zinc-50 dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <Image src="/file.svg" alt="Website Maintenance" width={64} height={64} className="mb-4 dark:invert" />
            <h3 className="text-2xl font-semibold mb-3 text-black dark:text-white">Website Maintenance</h3>
            <p className="text-zinc-700 dark:text-zinc-300">
              Ongoing support, updates, security monitoring, and performance optimization.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action / About Snippet */}
      <section className="w-full max-w-6xl text-center py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white rounded-lg shadow-lg mb-16">
        <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Digital Presence?</h2>
        <p className="text-xl max-w-3xl mx-auto mb-8">
          We're passionate about bringing your vision to life. Let's create something amazing together.
        </p>
        <Link
          href="/about"
          className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
        >
          Learn More About Us
        </Link>
      </section>
    </div>
  );
}
