import React from "react";

const AboutPage = () => {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <main className="w-full max-w-4xl bg-white dark:bg-black shadow-lg rounded-lg p-8 space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-black dark:text-white sm:text-5xl">
          About Our Company
        </h1>

        <section className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-center">
          <p className="mb-4">
            Welcome to Gaurav Kaushik, your trusted partner in crafting exceptional digital experiences. We are an innovative IT company specializing in comprehensive website solutions, from initial concept and design to robust development and ongoing maintenance.
          </p>
          <p>
            Our mission is to empower businesses with a strong online presence, delivering websites that are not only visually stunning but also highly functional, secure, and tailored to meet your unique business objectives.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-3">Website Design</h2>
            <p className="text-gray-600 dark:text-gray-400">
              We believe in creating captivating and intuitive user interfaces. Our design process focuses on understanding your brand identity and target audience to deliver bespoke designs that enhance user experience and drive engagement.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-3">Website Development</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Leveraging the latest technologies and best practices, our expert developers build high-performance, scalable, and secure websites. Whether it's a simple informational site or a complex e-commerce platform, we bring your vision to life.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-3">Website Maintenance</h2>
            <p className="text-gray-600 dark:text-gray-400">
              A website is a living entity. We offer ongoing maintenance, updates, security monitoring, and performance optimization services to ensure your website remains current, secure, and operates flawlessly 24/7.
            </p>
          </div>
        </div>

        <section className="text-center mt-10">
          <p className="text-xl font-medium text-black dark:text-white">
            Partner with us to transform your digital presence and achieve your business goals.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 mt-2">
            Contact us today to discuss your next project!
          </p>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
