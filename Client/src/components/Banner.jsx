import React from "react";
import { motion } from "motion/react";

const Banner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-between md:flex-row md:items-start px-8 min:md-pl-14 pt-10 bg-gradient-to-r from-[#0558FE] to-[#a9cfff] max-w-6xl mx-3 rounded-2xl md:mx-auto overflow-hidden"
    >
      <div className="text-white ">
        <h2 className="text-3xl font-medium">Do You Own a Luxury Car?</h2>
        {/* <p>Share it with us and start renting it out</p> */}
        <p className="mt-2">
          Monetize your vehicle effortlessly by listing it on our CarRental.
        </p>
        <p className="max-w-130">
          we can take care of insurance, driver verification and secure payments
          - So you can earn passive income, stress-free.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 rounded-lg bg-white text-primary hover:bg-slate-180 text-sm mt-4 transition-all cursor-pointer"
        >
          List Your Car
        </motion.button>
      </div>
      <motion.img
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1920"
        alt="car"
        className="max-h-45 mt-16"
      />
    </motion.div>
  );
};

export default Banner;
