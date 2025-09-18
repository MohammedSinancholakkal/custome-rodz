import React from "react";
import "./Aboutus.css";

function Aboutus() {


  return (
    <>
      {/* Hero About Section */}
      <section className="about-section">
        <div className="overlay">
          <div className="about-content text-light">
            <h1 className="text-light">About Us</h1>
            <h3 className="text-light">Full-service Bike Workshop</h3>
            <p>
              At <strong className="text-light">CUSTOM RODZ Bike Workshop </strong>, we live and breathe
              motorcycles. From basic tune-ups to full engine rebuilds, our
              expert mechanics ensure your ride is always in peak condition.
            </p>
            <p>
              Our workshop is open, friendly, and fully equipped with the latest
              tools and technology. No roadblocks, no delays — just fast,
              reliable service that gets you back on the road where you belong.
            </p>
          </div>
        </div>
      </section>

    </>
  );
}

export default Aboutus;
