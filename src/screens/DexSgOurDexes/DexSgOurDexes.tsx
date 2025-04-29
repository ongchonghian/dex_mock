import React, { useState } from "react";
import { Badge } from "../../components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown";
import { ChevronDown, Menu, Info } from "lucide-react";

// ROI Calculator default values
const defaultValues = {
  num_partners: 5,
  avg_tx_per_partner: 1000,
  int_build_cost_per_partner: 15000,
  int_maint_pct: 20,
  api_fee_per_tx: 0.05,
  compliance_cost_annual: 50000,
  error_penalty_rate: 15,
  error_rate_legacy: 3,
  error_rate_platform: 0.5,
  onboard_days_legacy: 30,
  onboard_days_platform: 5,
  daily_revenue_per_partner: 2000,
};

// Scenario presets
const scenarios = {
  conservative: {
    ...defaultValues,
    num_partners: 3,
    avg_tx_per_partner: 500,
    daily_revenue_per_partner: 1000,
  },
  optimistic: {
    ...defaultValues,
    num_partners: 10,
    avg_tx_per_partner: 2000,
    daily_revenue_per_partner: 3000,
  },
};

// Metric explanations
const metricExplanations = {
  totalBenefit: {
    title: "Total Benefit",
    formula: "Revenue Impact + Cost Savings + Risk Mitigation",
    what: "Comprehensive measure of financial gains from adopting our platform, combining direct savings, additional revenue, and risk reduction.",
    why: "Shows the complete picture of value creation, helping justify investment decisions and demonstrate ROI to stakeholders.",
    hook: "Our platform delivers value across multiple dimensions, from operational efficiency to revenue acceleration. See how much you could gain with a modern data exchange solution.",
  },
  costSaving: {
    title: "Cost Savings",
    formula: "Legacy Costs - Platform Costs",
    what: "Direct reduction in operational expenses from replacing legacy systems with our streamlined platform.",
    why: "Immediate impact on bottom line through reduced integration, maintenance, and transaction costs.",
    hook: "Stop overpaying for outdated data exchange methods. Our platform typically reduces operational costs by 40-60% while delivering superior capabilities.",
  },
  revenueSaving: {
    title: "Revenue Impact",
    formula: "Partners × Daily Revenue × Time Saved",
    what: "Additional revenue captured by reducing partner onboarding time and eliminating trading delays.",
    why: "Faster time-to-revenue means better cash flow and competitive advantage in fast-moving markets.",
    hook: "Every day spent onboarding partners is lost revenue. Our platform cuts integration time by 80%, getting you to revenue faster.",
  },
  riskSaving: {
    title: "Risk Mitigation",
    formula: "Legacy Error Costs - Platform Error Costs",
    what: "Financial benefit of reduced errors, penalties, and compliance issues through automated validation.",
    why: "Protects revenue and reputation by preventing costly mistakes and ensuring regulatory compliance.",
    hook: "Data errors cost more than just money - they damage relationships and reputation. Our platform's built-in validation prevents costly mistakes.",
  },
};

export const DexSgOurDexes = (): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [calculatorValues, setCalculatorValues] = useState(defaultValues);
  const [scenario, setScenario] = useState("default");
  const [roiResults, setRoiResults] = useState({
    totalBenefit: 0,
    costSaving: 0,
    revenueSaving: 0,
    riskSaving: 0,
  });
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Calculator functions
  const calculateLegacyCosts = (values: typeof defaultValues) => {
    const legacy_int_build = values.num_partners * values.int_build_cost_per_partner;
    const legacy_int_maint = legacy_int_build * (values.int_maint_pct / 100);
    const legacy_api_fees = values.num_partners * values.avg_tx_per_partner * 12 * values.api_fee_per_tx;
    const legacy_compliance = values.compliance_cost_annual;
    const legacy_error_cost = values.num_partners * values.avg_tx_per_partner * 12 * (values.error_rate_legacy / 100) * values.error_penalty_rate;
    
    return {
      total: legacy_int_build + legacy_int_maint + legacy_api_fees + legacy_compliance + legacy_error_cost,
      error_cost: legacy_error_cost,
    };
  };

  const calculatePlatformCosts = (values: typeof defaultValues) => {
    const platform_sub_fee = 10000 + (values.num_partners * 1000);
    const platform_tx_fee = values.num_partners * values.avg_tx_per_partner * 12 * 0.01;
    const platform_compliance = values.compliance_cost_annual * 0.4;
    const platform_error_cost = values.num_partners * values.avg_tx_per_partner * 12 * (values.error_rate_platform / 100) * values.error_penalty_rate;
    
    return {
      total: platform_sub_fee + platform_tx_fee + platform_compliance + platform_error_cost,
      error_cost: platform_error_cost,
    };
  };

  const calculateBenefits = (values: typeof defaultValues) => {
    const legacyCosts = calculateLegacyCosts(values);
    const platformCosts = calculatePlatformCosts(values);
    
    const onboarding_time_saved = values.onboard_days_legacy - values.onboard_days_platform;
    const revenue_uplift = values.num_partners * values.daily_revenue_per_partner * onboarding_time_saved;
    const cost_saving = legacyCosts.total - platformCosts.total;
    const risk_saving = legacyCosts.error_cost - platformCosts.error_cost;
    
    return {
      totalBenefit: revenue_uplift + cost_saving + risk_saving,
      costSaving: cost_saving,
      revenueSaving: revenue_uplift,
      riskSaving: risk_saving,
    };
  };

  const handleCalculate = () => {
    const results = calculateBenefits(calculatorValues);
    setRoiResults(results);
  };

  const handleScenarioChange = (newScenario: string) => {
    setScenario(newScenario);
    if (newScenario === "conservative") {
      setCalculatorValues(scenarios.conservative);
    } else if (newScenario === "optimistic") {
      setCalculatorValues(scenarios.optimistic);
    } else {
      setCalculatorValues(defaultValues);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCalculatorValues(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
    setScenario("custom");
  };

  // Data for use cases
  const useCases = [
    {
      id: 1,
      title: "Use Case 1: Clinical Data Sharing Across Networks",
      description:
        "Easily and securely exchange patient data between hospitals, clinics, and specialists to ensure continuity of care, minimize duplication, and enhance treatment precision. Healthdex enables encrypted, real-time data sharing to power coordinated care strategies.",
      imageSrc: "/image-1.png",
      imageAlt: "Clinical Data Sharing",
      position: "right",
    },
    {
      id: 2,
      title: "Use Case 2: Accelerated Research & Clinical Trials",
      description:
        "Facilitate faster, data-driven medical research by granting researchers controlled access to vast, anonymized patient datasets. Healthdex speeds up discovery timelines while maintaining stringent privacy and regulatory standards.",
      imageSrc: "/image-3.png",
      imageAlt: "Accelerated Research",
      position: "left",
    },
    {
      id: 3,
      title: "Use Case 3: Performance Benchmarking & Insights",
      description:
        "Leverage aggregated healthcare data to analyze trends, benchmark performance, and identify areas for operational improvement. With Healthdex, organizations can harness actionable intelligence to optimize both clinical and business outcomes.",
      imageSrc: "/image-2.png",
      imageAlt: "Performance Benchmarking",
      position: "right",
    },
  ];

  // Data for statistics
  const statistics = [
    {
      value: "99.9%",
      title: "Data Accuracy Achieved",
      description:
        "With DEX SG, your data becomes a strategic asset, empowering you to make informed decisions and achieve exceptional results.",
    },
    {
      value: "30%",
      title: "Increase In Operational efficiency",
      description:
        "With DEX SG, your data becomes a strategic asset, empowering you to make informed decisions and achieve exceptional results.",
    },
    {
      value: "25%",
      title: "Average Growth In Client revenue",
      description:
        "With DEX SG, your data becomes a strategic asset, empowering you to make informed decisions and achieve exceptional results.",
    },
    {
      value: "10yrs",
      title: "Over 10 Years Of Experience in Data Analytics",
      description:
        "With DEX SG, your data becomes a strategic asset, empowering you to make informed decisions and achieve exceptional results.",
    },
  ];

  // Data for partners
  const partners = [
    { id: 1, imageSrc: "/mask-group-1.png" },
    { id: 2, imageSrc: "/mask-group-2.png" },
    { id: 3, imageSrc: "/mask-group-3.png" },
    { id: 4, imageSrc: "/mask-group-4.png" },
    { id: 5, imageSrc: "/mask-group-5.png" },
    { id: 6, imageSrc: "/mask-group-6.png" },
  ];

  // Data for certifications
  const certifications = [
    { id: 1, imageSrc: "/63377932-eps--converted-.png" },
    { id: 2, imageSrc: "/66515805-eps--converted-.png" },
    { id: 3, imageSrc: "/63377932-eps--converted--1.png" },
    { id: 4, imageSrc: "/66515805-eps--converted--1.png" },
  ];

  // Data for navigation links
  const navLinks = [
    { title: "Our Dexes", active: true },
    { title: "Services", active: false },
    { title: "About Us", active: false },
    { title: "Support", active: false },
    { title: "Resources", active: false },
  ];

  // Data for footer links
  const sitemapLinks = [
    { title: "Home", active: true },
    { title: "Our Dexes", active: false },
    { title: "Services", active: false },
    { title: "About Us", active: false },
    { title: "Support", active: false },
    { title: "Resources", active: false },
  ];

  const otherLinks = [
    { title: "Terms & Conditions" },
    { title: "Privacy Policy" },
  ];

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full relative">
        {/* Fixed Navigation */}
        <header className="fixed w-full h-[100px] top-0 left-0 bg-neutralswhite border-b border-[#c9c9c9] z-50">
          <div className="container mx-auto flex items-center justify-between h-full px-4">
            <img
              className="h-[71px] w-auto"
              alt="Logo on white"
              src="/logo-on-white-clearspace-1.png"
            />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-[60px]">
              {navLinks.map((link, index) => (
                <DropdownMenu key={index}>
                  <DropdownMenuTrigger className="flex items-center gap-2">
                    <span
                      className={`font-inter text-base tracking-[-0.30px] ${
                        link.active ? "text-blue-tintblue-tint" : "text-neutralsdark"
                      }`}
                    >
                      {link.title}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Option 1</DropdownMenuItem>
                    <DropdownMenuItem>Option 2</DropdownMenuItem>
                    <DropdownMenuItem>Option 3</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </nav>

            {/* Mobile Navigation */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              {isMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white border-b border-[#c9c9c9] py-4">
                  {navLinks.map((link, index) => (
                    <a
                      key={index}
                      href="#"
                      className={`block px-4 py-2 font-inter text-base tracking-[-0.30px] ${
                        link.active ? "text-blue-tintblue-tint" : "text-neutralsdark"
                      }`}
                    >
                      {link.title}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-6">
              <img
                className="w-[38px] h-[38px]"
                alt="Search"
                src="/frame-1.svg"
              />
              <Button
                variant="outline"
                className="h-[50px] rounded-sm border-[#1e2215]"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section
          className="w-full h-[520px] mt-[100px] bg-cover bg-center"
          style={{ backgroundImage: 'url("/mask-group.png")' }}
        >
          <div className="container mx-auto px-4 pt-[193px]">
            <div className="flex flex-col items-start gap-3.5">
              <h1 className="font-['Urbanist'] font-medium text-white text-[85px] tracking-[-0.85px] leading-none">
                HealthDex
              </h1>

              <Breadcrumb className="text-[#ffffff80]">
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="#"
                    className="text-base tracking-[-0.16px]"
                  >
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <img
                    src="/frame-2.svg"
                    alt="Separator"
                    className="w-[19px] h-[19px]"
                  />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="#"
                    className="text-base tracking-[-0.16px]"
                  >
                    Our Dexes
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <img
                    src="/frame-2.svg"
                    alt="Separator"
                    className="w-[19px] h-[19px]"
                  />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <span className="font-semibold text-white text-base tracking-[-0.16px]">
                    Healthdex
                  </span>
                </BreadcrumbItem>
              </Breadcrumb>
            </div>
          </div>
        </section>

        {/* Problem Statement Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full lg:w-1/2 px-4">
              <div className="flex flex-col gap-[30px] max-w-[682px]">
                <div className="flex flex-col gap-[26px]">
                  <Badge className="bg-transparent text-[#d2a0ff] font-sub-title-top text-[length:var(--sub-title-top-font-size)] tracking-[var(--sub-title-top-letter-spacing)] rounded-none px-0">
                    HEALTHDEX
                  </Badge>
                  <h2 className="font-h2 text-neutralsdark text-[length:var(--h2-font-size)] tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)]">
                    Problem Statement
                  </h2>
                </div>
                <p className="font-body text-[#313438] text-[length:var(--body-font-size)] tracking-[var(--body-letter-spacing)] leading-[var(--body-line-height)]">
                  Today's healthcare landscape faces fragmented data systems,
                  limited interoperability, and rising operational costs. Health
                  professionals struggle to gain a unified, real-time view of
                  patient information, leading to inefficiencies and missed
                  opportunities for better outcomes. Healthdex aims to bridge this
                  gap by delivering seamless, secure, and scalable data solutions
                  that empower smarter decisions and improved care.
                </p>
              </div>
            </div>
            <div className="w-full lg:w-1/2 px-4 mt-10 lg:mt-0">
              <img
                className="w-full max-w-[616px] h-auto mx-auto"
                alt="Healthcare data visualization"
                src="/image.png"
              />
            </div>
          </div>
        </section>

        {/* About Healthdex Section */}
        <section className="w-full py-20 [background:linear-gradient(180deg,rgba(248,242,255,1)_0%,rgba(255,255,255,1)_100%)] relative">
          {/* Background decorative elements */}
          <img
            className="absolute w-[912px] h-[922px] top-[120px] right-0 z-0 pointer-events-none"
            alt="Vector decoration"
            src="/vector.svg"
          />
          <img
            className="absolute w-[317px] h-[753px] bottom-[578px] left-0 z-0 pointer-events-none"
            alt="Vector decoration"
            src="/vector.svg"
          />

          <div className="container mx-auto px-4 relative z-10">
            {/* About Healthdex Header */}
            <div className="flex flex-col items-center gap-[30px] max-w-[1099px] mx-auto mb-20">
              <div className="flex flex-col items-center gap-[26px] w-full">
                <Badge className="bg-transparent text-[#d2a0ff] font-sub-title-top text-[length:var(--sub-title-top-font-size)] tracking-[var(--sub-title-top-letter-spacing)] text-center rounded-none">
                  HEALTHDEX
                </Badge>
                <h2 className="font-h2 text-neutralsdark text-[length:var(--h2-font-size)] text-center tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)]">
                  About Healthdex
                </h2>
              </div>
              <p className="font-body text-[#313438] text-[length:var(--body-font-size)] text-center tracking-[var(--body-letter-spacing)] leading-[var(--body-line-height)]">
                Healthdex is a cutting-edge data exchange platform designed
                specifically for the healthcare industry. It enables organizations
                to access, share, and leverage critical insights securely and
                efficiently. With Healthdex, healthcare providers, researchers, and
                policymakers can foster better collaboration, drive innovations, and
                enhance patient care outcomes.
              </p>
            </div>

            {/* Use Cases */}
            {useCases.map((useCase, index) => (
              <div
                key={useCase.id}
                className="flex flex-wrap items-center mb-20 -mx-4"
              >
                {/* Image column - changes position based on use case */}
                <div
                  className={`w-full lg:w-1/2 px-4 ${
                    useCase.position === "right" ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <img
                    className="w-full max-w-[734px] h-auto mx-auto"
                    alt={useCase.imageAlt}
                    src={useCase.imageSrc}
                  />
                </div>

                {/* Text column */}
                <div
                  className={`w-full lg:w-1/2 px-4 mt-10 lg:mt-0 ${
                    useCase.position === "right" ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <div className="flex flex-col gap-[30px] max-w-[565px] mx-auto">
                    <h3 className="font-['Urbanist'] font-medium text-neutralsdark text-[50px] tracking-[-0.50px] leading-normal">
                      {useCase.title}
                    </h3>
                    <p className="font-body text-[#313438] text-[length:var(--body-font-size)] tracking-[var(--body-letter-spacing)] leading-[var(--body-line-height)]">
                      {useCase.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* ROI Calculator */}
            <Card className="w-full h-auto bg-[#160b25] rounded-xl bg-cover bg-center">
              <CardContent className="p-6 lg:p-10">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-[26px]">
                    <Badge className="bg-transparent text-[#d2a0ff] font-sub-title-top text-[length:var(--sub-title-top-font-size)] tracking-[var(--sub-title-top-letter-spacing)] rounded-none px-0">
                      CALCULATE
                    </Badge>
                    <h2 className="font-h2 text-neutralswhite text-[length:var(--h2-font-size)] tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)]">
                      ROI Calculator
                    </h2>
                  </div>

                  <div className="lg:w-1/2">
                    <p className="font-body text-neutralswhite text-[length:var(--body-font-size)] tracking-[var(--body-letter-spacing)] leading-[var(--body-line-height)]">
                      Calculate your potential return on investment with our platform. Choose a scenario or customize your inputs.
                    </p>
                  </div>

                  <div className="flex gap-4 mb-6">
                    <Button
                      onClick={() => handleScenarioChange("conservative")}
                      className={`${scenario === "conservative" ? "bg-blue-300" : "bg-transparent"} text-white border border-white`}
                    >
                      Conservative
                    </Button>
                    <Button
                      onClick={() => handleScenarioChange("default")}
                      className={`${scenario === "default" ? "bg-blue-300" : "bg-transparent"} text-white border border-white`}
                    >
                      Default
                    </Button>
                    <Button
                      onClick={() => handleScenarioChange("optimistic")}
                      className={`${scenario === "optimistic" ? "bg-blue-300" : "bg-transparent"} text-white border border-white`}
                    >
                      Optimistic
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="text-sm mb-2 block text-white">
                        Number of Trading Partners
                      </label>
                      <Input
                        name="num_partners"
                        type="number"
                        value={calculatorValues.num_partners}
                        onChange={handleInputChange}
                        className="bg-neutralswhite text-[#9c9c9c] h-[55px] rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm mb-2 block text-white">
                        Monthly Transactions per Partner
                      </label>
                      <Input
                        name="avg_tx_per_partner"
                        type="number"
                        value={calculatorValues.avg_tx_per_partner}
                        onChange={handleInputChange}
                        className="bg-neutralswhite text-[#9c9c9c] h-[55px] rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm mb-2 block text-white">
                        Integration Cost per Partner (SGD)
                      </label>
                      <Input
                        name="int_build_cost_per_partner"
                        type="number"
                        value={calculatorValues.int_build_cost_per_partner}
                        onChange={handleInputChange}
                        className="bg-neutralswhite text-[#9c9c9c] h-[55px] rounded"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleCalculate}
                    className="w-full lg:w-auto h-[55px] bg-blue-300 hover:bg-blue-400 text-neutralswhite rounded mt-6"
                  >
                    Calculate ROI
                  </Button>

                  {roiResults.totalBenefit > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                      {Object.entries(metricExplanations).map(([key, metric]) => (
                        <div
                          key={key}
                          className={`bg-[rgba(255,255,255,0.1)] p-6 rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedMetric === key ? "ring-2 ring-blue-300" : ""
                          }`}
                          onClick={() => setSelectedMetric(selectedMetric === key ? null : key)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-[#d2a0ff] text-lg">{metric.title}</h4>
                            <Info className="w-4 h-4 text-[#d2a0ff]" />
                          </div>
                          <p className="text-white text-2xl font-semibold">
                            SGD {roiResults[key as keyof typeof roiResults].toLocaleString()}
                          </p>
                          {selectedMetric === key && (
                            <div className="mt-4 text-white text-sm">
                              <p className="font-semibold mb-2">Formula:</p>
                              <p className="mb-4 text-[#d2a0ff]">{metric.formula}</p>
                              <p className="font-semibold mb-2">What it measures:</p>
                              <p className="mb-4">{metric.what}</p>
                              <p className="font-semibold mb-2">Why it matters:</p>
                              <p className="mb-4">{metric.why}</p>
                              <p className="italic text-[#d2a0ff]">{metric.hook}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="container mx-auto px-4 py-10">
          <Card
            className="w-full h-auto lg:h-[550px] rounded-xl bg-cover bg-center text-white"
            style={{ backgroundImage: 'url("/image-6.png")' }}
          >
            <CardContent className="p-6 lg:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {statistics.map((stat, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center"
                  >
                    <h3 className="font-['Urbanist'] font-semibold text-neutralswhite text-[70px] tracking-[-0.70px]">
                      {stat.value}
                    </h3>
                    <Separator className="w-[47px] h-[3px] bg-white my-6" />
                    <h4 className="font-['Urbanist'] font-semibold text-neutralswhite text-[26px] tracking-[-0.26px] leading-[34px]">
                      {stat.title}
                    </h4>
                    <p className="font-['Inter'] text-[#aaa0c2] text-base tracking-[-0.30px] leading-[26px] mt-6 max-w-[300px]">
                      {stat.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Partners Section */}
        <section className="container mx-auto px-4 py-20">
          <h2 className="font-['Urbanist'] font-medium text-neutralsdark text-[80px] tracking-[-0.80px] leading-[80px] text-center mb-6">
            Partners
          </h2>
          <p className="font-['Urbanist'] font-semibold text-neutralsdark text-xl tracking-[-0.20px] leading-[34px] text-center max-w-[1100px] mx-auto mb-16">
            We Collaborate With Industry-leading Organizations To Create Powerful,
            Seamless Data Ecosystems. Our Trusted Partners Help Us Drive Innovation
            And Deliver World-class Solutions To Our Clients.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="h-[110px] bg-[#f1f1f1] rounded-md"
                style={{
                  backgroundImage: `url(${partner.imageSrc})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ))}
          </div>
        </section>

        {/* Certifications Section */}
        <section className="container mx-auto px-4 py-10">
          <h2 className="font-['Urbanist'] font-medium text-neutralsdark text-[80px] tracking-[-0.80px] leading-[80px] text-center mb-16">
            Certifications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-[1147px] mx-auto">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="h-[313px] bg-[#f2f2f2] rounded"
                style={{
                  backgroundImage: `url(${cert.imageSrc})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <div className="flex items-center gap-3.5">
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={index}
                    className={`w-2.5 h-2.5 rounded-[5px] ${
                      index === 0 ? "bg-blue-400" : "bg-blue-100"
                    }`}
                  />
                ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="container mx-auto px-4 py-10">
          <Card
            className="w-full h-auto lg:h-[437px] rounded-xl bg-cover bg-center text-white"
            style={{ backgroundImage: 'url("/image-7.png")' }}
          >
            <CardContent className="flex flex-col items-center justify-center h-full p-6 lg:p-10">
              <Badge className="bg-transparent text-[#d2a0ff] font-sub-title-top text-[length:var(--sub-title-top-font-size)] tracking-[var(--sub-title-top-letter-spacing)] rounded-none">
                GET STARTED
              </Badge>
              <h2 className="font-['Urbanist'] font-medium text-neutralswhite text-[80px] tracking-[-0.80px] leading-[80px] mt-4 text-center">
                Contact Us Today
              </h2>
              <Button className="flex items-center gap-[18px] mt-10">
                <div className="w-[55px] h-[55px] bg-blue-300 rounded-sm flex items-center justify-center">
                  <img className="w-4 h-4" alt="Arrow" src="/vector-3.svg" />
                </div>
                <span className="font-['Inter'] text-neutralswhite text-lg tracking-[-0.36px]">
                  Contact Us
                </span>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="w-full bg-[#160b25] text-white py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {/* Newsletter Section */}
              <div className="lg:col-span-2">
                <Badge className="bg-transparent text-blue-100 font-sub-title-top text-[length:var(--sub-title-top-font-size)] tracking-[var(--sub-title-top-letter-spacing)] rounded-none px-0">
                  NEWSLETTER
                </Badge>
                <h2 className="font-['Urbanist'] font-medium text-neutralswhite text-[80px] tracking-[-0.80px] leading-[80px] mt-2">
                  Subscribe To Our
                  <br />
                  mailing List
                </h2>

                <div className="flex items-center gap-[15px] mt-10">
                  <Input
                    className="h-[55px] bg-transparent border-white text-neutralswhite placeholder:text-neutralswhite placeholder:opacity-[0.37]"
                    placeholder="Enter your email address"
                  />
                  <Button className="w-[55px] h-[55px] p-0 bg-blue-300 rounded-sm flex items-center justify-center">
                    <img className="w-4 h-4" alt="Submit" src="/vector-3.svg" />
                  </Button>
                </div>

                <div className="flex gap-6 mt-10">
                  <Button
                    variant="outline"
                    className="w-[77px] h-[77px] rounded-full border-white p-0"
                  >
                    <img
                      className="w-[13px] h-[25px]"
                      alt="Facebook"
                      src="/vector-1.svg"
                    />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-[77px] h-[77px] rounded-full border-white p-0"
                  >
                    <img
                      className="w-6 h-6"
                      alt="Twitter"
                      src="/vector-4.svg"
                    />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-[77px] h-[77px] rounded-full border-white p-0"
                  >
                    <img
                      className="w-[22px] h-[22px]"
                      alt="Instagram"
                      src="/vector-7.svg"
                    />
                  </Button>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="font-['Urbanist'] font-semibold text-neutralswhite text-xl tracking-[-0.20px]">
                  Contact Information
                </h3>
                <div className="mt-[30px] space-y-6">
                  <div className="flex items-start gap-4">
                    <img
                      className="w-5 h-5 mt-1"
                      alt="Location"
                      src="/frame-4.svg"
                    />
                    <p className="font-['Inter'] text-[#726486] text-base tracking-[-0.30px] leading-6">
                      1234 Dummy location with, Lorem ipsum dolor sit, 6789
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <img
                      className="w-[21px] h-[21px]"
                      alt="Email"
                      src="/frame-5.svg"
                    />
                    <p className="font-['Inter'] text-[#726486] text-base tracking-[-0.30px]">
                      dexsg.info@email.com
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <img
                      className="w-[21px] h-[21px]"
                      alt="Phone"
                      src="/frame.svg"
                    />
                    <p className="font-['Inter'] text-[#726486] text-base tracking-[-0.30px]">
                      +65 1234 5678
                    </p>
                  </div>
                </div>
              </div>

              {/* Sitemap */}
              <div>
                <h3 className="font-['Urbanist'] font-semibold text-neutralswhite text-xl tracking-[-0.20px]">
                  Sitemap
                </h3>
                <div className="mt-[30px] space-y-[30px]">
                  {sitemapLinks.map((link, index) => (
                    <a
                      key={index}
                      href="#"
                      className={`block font-['Inter'] text-base tracking-[-0.30px] ${
                        link.active ? "text-blue-tintblue-tint" : "text-[#726486]"
                      }`}
                    >
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>

              {/* Other Links */}
              <div>
                <h3 className="font-['Urbanist'] font-semibold text-neutralswhite text-xl tracking-[-0.20px]">
                  Other Links
                </h3>
                <div className="mt-[30px] space-y-[30px]">
                  {otherLinks.map((link, index) => (
                    <a
                      key={index}
                      href="#"
                      className="block font-['Inter'] text-[#726486] text-base tracking-[-0.30px]"
                    >
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Logo */}
            <div className="flex justify-end mt-20">
              <img
                className="w-[362px] h-auto"
                alt="Logo on blue black"
                src="/logo-on-blue-black-clearspace-2.png"
              />
            </div>

            {/* Copyright */}
            <div className="flex flex-col md:flex-row items-center justify-between mt-20 text-[#726486] text-sm gap-4">
              <p className="font-['Inter'] text-center md:text-left">
                Copyright © 2025 Company Name. All Rights Reserved.
              </p>
              <div className="flex items-center">
                <p className="font-['Poppins']">
                  <span>Web Excellence by </span>
                  <span className="font-bold text-white">Verz</span>
                </p>
                <img
                  className="w-[15px] h-[13px] ml-0.5"
                  alt="Verz logo"
                  src="/group-2-1.svg"
                />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};