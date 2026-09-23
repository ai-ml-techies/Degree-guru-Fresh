import { Helmet } from "react-helmet-async";
import { RoiCalculator } from "@/components/RoiCalculator";

export const RoiCalculatorPage = () => {
  return (
    <>
      <Helmet>
        <title>Degree ROI & Salary Jump Calculator | Degree Guru</title>
        <meta
          name="description"
          content="Calculate your online degree return on investment. Estimate salary hikes, payback period in months, and compare tuition fees with projected earnings."
        />
        <link rel="canonical" href="https://degreeguru.in/roi-calculator/" />
      </Helmet>

      <div className="container-dg py-8 md:py-14">
        <RoiCalculator />
      </div>
    </>
  );
};
export default RoiCalculatorPage;
