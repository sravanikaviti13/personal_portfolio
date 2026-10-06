/* ------------------------------------------------------------------
   All site content lives here. Edit this file; no HTML changes needed.
   ------------------------------------------------------------------ */
const DATA = {
  profile: {
    name: "Sravani Kaviti",
    roles: [
      "Computer Vision Engineer",
      "Applied AI Engineer",
      "ML on the edge",
      "Perception for autonomous driving",
    ],
    tagline:
      "I build machine-learning and computer-vision systems that have to work outside the notebook: real-time models on edge hardware, and ML tools used by hundreds of colleagues.",
    location: "Dresden, Germany",
    email: "sravanika76@gmail.com",
    github: "https://github.com/sravanikaviti13",
    linkedin: "https://www.linkedin.com/in/sravani-kaviti/",
    cv: "assets/Sravani_Kaviti_CV.pdf",
    photo: "assets/photo.jpg", // drop a photo here; initials are shown if the file is missing
  },

  stats: [
    { value: 4, suffix: "+", label: "years in software, data & ML" },
    { value: 98.34, suffix: "%", decimals: 2, label: "traffic-sign validation accuracy (211 classes)" },
    { value: 10, prefix: "7–", suffix: " FPS", label: "full perception stack on Jetson Orin NX" },
    { value: 200, suffix: "", label: "employees onboarded to an app I built in 3 months" },
  ],

  about: {
    paragraphs: [
      "My path went from backend engineering on an insurance platform, to data analysis in a semiconductor fab, to applied AI, and now to real-time computer vision for autonomous-driving safety evaluation.",
      "What ties it together is shipping: taking a model from a paper or a notebook and making it run reliably on real hardware, or in a real workflow, with the numbers to prove it.",
      "I'm finishing an M.Sc. in Visual Computing at TU Dresden, with a thesis on machine-interpretable traffic regulations for autonomous-driving compliance.",
    ],
    now: [
      { k: "Working on", v: "ROS 2 perception on NVIDIA Jetson at FSD Fahrzeugsystemdaten" },
      { k: "Thesis", v: "Machine-Interpretable Traffic Regulations for Autonomous-Driving Compliance" },
      { k: "Languages", v: "English (C1) · German (B1)" },
      { k: "Based in", v: "Dresden, Germany" },
    ],
  },

  /* "From model to edge" stepper: mirrors the deployment workflow in the CV */
  pipeline: [
    {
      title: "Data",
      tool: "KITTI · road-scene subsets · German traffic signs",
      text: "Curate and label road-scene data, check class balance, and hold out subsets that reflect on-road conditions rather than benchmark conditions.",
    },
    {
      title: "Train",
      tool: "PyTorch · YOLOv8 / YOLO11 · EfficientNet-B0 · U-Net",
      text: "Fine-tune and benchmark candidates side by side. YOLO11m won for longer-range detection (mAP50 0.68 on my road-scene subset).",
    },
    {
      title: "Export",
      tool: "ONNX → TensorRT",
      text: "Export PyTorch weights through ONNX and build TensorRT engines so inference fits the Jetson's latency budget.",
    },
    {
      title: "Fuse",
      tool: "ZED SDK · stereo depth · 3D tracking",
      text: "Combine detection with stereo depth and 3D tracking, with custom ID stabilisation so objects keep their identity between frames.",
    },
    {
      title: "Deploy",
      tool: "ROS 2 · NVIDIA Jetson Orin NX · Docker",
      text: "Run a multi-camera ROS 2 pipeline that outputs distance, relative velocity and time-to-collision: 7–10 FPS in on-road testing.",
    },
  ],

  experience: [
    {
      id: "fsd",
      role: "Computer Vision Engineer (AV Safety Evaluation)",
      org: "FSD Fahrzeugsystemdaten GmbH",
      place: "Dresden, Germany",
      period: "Jan 2026 – Present",
      tags: ["ROS 2", "Jetson Orin NX", "TensorRT", "YOLO11", "ZED SDK"],
      bullets: [
        "Developed and deployed a ROS 2 multi-camera perception pipeline on NVIDIA Jetson Orin NX, combining object detection, stereo depth, 3D tracking, traffic-sign recognition, and time-to-collision estimation for safety evaluation.",
        "Fine-tuned and benchmarked YOLOv8 and YOLO11 models for road-object detection, selecting YOLO11m for longer-range inference; achieved mAP50 of 0.68 on a road-scene subset and exported PyTorch weights through ONNX to TensorRT engines for Jetson deployment.",
        "Built a two-stage traffic-sign recognition pipeline using YOLO detection and EfficientNet-B0 classification, achieving 98.34% validation accuracy across 211 German traffic-sign classes.",
        "Integrated ZED SDK stereo depth and 3D object tracking with custom ID stabilization and TTC logic to calculate object distance, relative velocity, and time to collision; achieved 7–10 FPS during on-road testing.",
        "Designed a prototype ego-lane detection module by fusing a KITTI-trained ResNet-18 U-Net with UFLD lane-line detection, achieving IoU scores of 0.913 for road segmentation and 0.924 for ego-lane segmentation.",
      ],
    },
    {
      id: "inf-ai",
      role: "Applied AI Engineer",
      org: "Infineon Technologies",
      place: "Dresden, Germany",
      period: "Jan 2025 – Dec 2025",
      tags: ["LambdaMART", "Ranking", "LLMs", "Semantic matching", "Full-stack"],
      bullets: [
        "Developed a Workshop Management Application adopted by approximately 200 employees within three months, supporting workshop creation, moderator assignment, feedback, and administrative workflows.",
        "Built and evaluated a LambdaMART moderator-recommendation system using skill, location, and feedback features, achieving NDCG@5 of 0.68 on 20 held-out workshops and a 25% improvement over a skill-and-location baseline.",
        "Implemented moderator-management, approval, and notification workflows, supporting approximately 15 workshops during the initial three-month rollout.",
        "Implemented LLM-based semantic matching to evaluate participant responses in a gamified learning platform using generative AI, reaching more than 100 active learners among 500+ employees.",
      ],
    },
    {
      id: "inf-da",
      role: "Data Analyst",
      org: "Infineon Technologies",
      place: "Dresden, Germany",
      period: "Jan 2024 – Dec 2024",
      tags: ["SQL", "KNIME", "XGBoost", "Clustering", "Python"],
      bullets: [
        "Integrated over 80K records from planning and equipment databases using SQL, reconstructing equipment-change histories and linking gas, energy, and dose parameters to setup times.",
        "Performed exploratory, statistical, and clustering analysis to identify equipment and process-parameter combinations associated with setup-time variation and longer setup durations.",
        "Trained Random Forest, XGBoost, and Gradient Boosting models in KNIME for setup-time prediction, integrating SQL queries and Python scripts; selected XGBoost with an R-squared of 0.57.",
        "Collaborated with domain teams to identify additional setup-time drivers and document cross-application data requirements for future model improvement.",
      ],
    },
    {
      id: "cts",
      role: "Software Engineer (Backend)",
      org: "Cognizant Technology Solutions",
      place: "Hyderabad, India",
      period: "Aug 2021 – Aug 2023",
      tags: ["Oracle", "SQL / PL/SQL", "Jenkins", "VBA"],
      bullets: [
        "Implemented Oracle Forms and SQL and PL/SQL solutions for an insurance claims platform, delivering three new forms from requirements through testing and supporting production deployment via Jenkins-based CI/CD workflows.",
        "Enhanced a Microsoft VBA documentation tool by improving macro performance and security, while automating a frequently generated report and reducing manual refinement and review effort by approximately 40%.",
        "Investigated data and production issues through SQL, ServiceNow, and stakeholder coordination, handling approximately 25 tickets weekly and generating census files for the insurance platform.",
      ],
    },
  ],

  /* cat: vision | gen | nlp | applied */
  projects: [
    {
      id: "perception",
      title: "Multi-Camera Perception on Jetson",
      cat: "vision",
      kicker: "FSD Fahrzeugsystemdaten · 2026",
      summary:
        "A ROS 2 pipeline that detects, tracks and measures road objects in real time and estimates time-to-collision, running on an NVIDIA Jetson Orin NX.",
      metrics: [
        { v: "0.68", l: "mAP50 (YOLO11m)" },
        { v: "7–10", l: "FPS on-road" },
      ],
      stack: ["ROS 2", "YOLO11", "TensorRT", "ONNX", "ZED SDK", "Jetson Orin NX"],
      details: [
        "Benchmarked YOLOv8 against YOLO11 and picked YOLO11m for longer-range detection.",
        "Exported PyTorch → ONNX → TensorRT engines for Jetson deployment.",
        "Stereo depth + 3D tracking with custom ID stabilisation produce distance, relative velocity and time-to-collision.",
      ],
    },
    {
      id: "tsr",
      title: "Two-Stage Traffic-Sign Recognition",
      cat: "vision",
      kicker: "FSD Fahrzeugsystemdaten · 2026",
      summary:
        "YOLO finds the sign, EfficientNet-B0 identifies it. Splitting detection from classification made 211 German sign classes tractable.",
      metrics: [
        { v: "98.34%", l: "val. accuracy" },
        { v: "211", l: "classes" },
      ],
      stack: ["YOLO", "EfficientNet-B0", "PyTorch", "Transfer learning"],
      details: [
        "Detection stage localises signs; classification stage handles the fine-grained label space.",
        "Runs as one node inside the ROS 2 perception stack.",
      ],
    },
    {
      id: "lane",
      title: "Ego-Lane Detection Prototype",
      cat: "vision",
      kicker: "FSD Fahrzeugsystemdaten · 2026",
      summary:
        "Fuses a KITTI-trained ResNet-18 U-Net road segmenter with UFLD lane-line detection to isolate the ego lane.",
      metrics: [
        { v: "0.924", l: "ego-lane IoU" },
        { v: "0.913", l: "road IoU" },
      ],
      stack: ["U-Net", "ResNet-18", "UFLD", "Semantic segmentation"],
      details: [
        "Road segmentation from the U-Net, lane geometry from UFLD, combined to produce an ego-lane mask.",
      ],
    },
    {
      id: "tactile",
      title: "Conditional Diffusion for Tactile Data Augmentation",
      cat: "gen",
      kicker: "University project · TU Dresden",
      summary:
        "Generates tactile sensor images directly from changes in a robot's state, so scarce tactile data can be augmented instead of collected.",
      metrics: [
        { v: "89.2%", l: "usable on held-out pairs" },
        { v: "~12K", l: "DIGIT images" },
      ],
      stack: ["Diffusion", "U-Net", "DINOv2", "Cross-attention", "PyTorch"],
      repo: "", // e.g. "https://github.com/sravanikaviti13/<repo-name>"
      details: [
        "Collected and processed ~12K DIGIT tactile images from a UFactory xArm7, paired with 19-dimensional kinematic deltas (joint angles, end-effector pose, force–torque).",
        "Conditional diffusion model: U-Net with DINOv2 image features and kinematic-delta cross-attention.",
        "Evaluated single- and multi-object variants with IoU, MSE, PSNR and SSIM. 68.6% usable reconstructions on unseen spatial gel regions.",
      ],
    },
    {
      id: "emotion",
      title: "Explainable Multi-Label Emotion Detection",
      cat: "nlp",
      kicker: "University project · TU Dresden",
      summary:
        "Fine-tuned RoBERTa and ALBERT for multi-label emotion classification, then checked whether the explanations could be trusted.",
      metrics: [
        { v: "0.782", l: "mean F1 (RoBERTa)" },
        { v: "13", l: "configurations" },
      ],
      stack: ["RoBERTa", "ALBERT", "Hugging Face", "SHAP", "PyTorch"],
      repo: "",
      details: [
        "Evaluated 13 model configurations with PyTorch and Hugging Face Transformers.",
        "Applied SHAP token attribution and human evaluation to assess explanation quality and robustness. Mean F1 of about 0.52 on manually labelled samples.",
      ],
    },
    {
      id: "workshop",
      title: "Workshop Management App + Moderator Recommender",
      cat: "applied",
      kicker: "Infineon · Innovation team · 2025",
      summary:
        "A full-stack app for running internal workshops, with a LambdaMART ranker that suggests the best moderators for each one.",
      metrics: [
        { v: "0.68", l: "NDCG@5" },
        { v: "+25%", l: "vs. skill + location baseline" },
      ],
      stack: ["LambdaMART", "Learning to rank", "Full-stack", "Email workflows"],
      details: [
        "Adopted by approximately 200 employees within three months; about 15 workshops created in the initial rollout.",
        "Ranker scores eligible moderators on skill alignment, location suitability and historical feedback, evaluated on 20 held-out workshops.",
        "Creators can filter by location or learning interest, pick alternatives, and send request or confirmation emails; admins approve new skills.",
      ],
    },
    {
      id: "learnquest",
      title: "LearnQuest: Gamified GenAI Learning",
      cat: "applied",
      kicker: "Infineon · Innovation team · 2025",
      summary:
        "A gamified platform that uses LLM-based semantic matching to judge learners' free-text answers.",
      metrics: [
        { v: "500+", l: "employees reached" },
        { v: "100+", l: "active learners" },
      ],
      stack: ["LLMs", "Semantic search", "Generative AI", "Gamification"],
      details: [
        "Co-developed with a colleague as part of the innovation team.",
        "Semantic matching evaluates participant responses instead of brittle keyword rules.",
      ],
    },
    {
      id: "setup",
      title: "Setup-Time Prediction",
      cat: "applied",
      kicker: "Infineon · Data analyst · 2024",
      summary:
        "Linked 80K+ planning and equipment records to explain and predict which process combinations lengthen equipment setup.",
      metrics: [
        { v: "80K+", l: "records integrated" },
        { v: "0.57", l: "R² (XGBoost)" },
      ],
      stack: ["SQL", "KNIME", "XGBoost", "Random Forest", "Clustering"],
      details: [
        "Reconstructed equipment-change histories and linked gas, energy and dose parameters to setup times.",
        "Compared Random Forest, XGBoost and Gradient Boosting; XGBoost was selected.",
        "Documented data gaps and cross-application requirements so later models can improve.",
      ],
    },
  ],

  skills: [
    { group: "Computer Vision", items: ["YOLO", "OpenCV", "EfficientNet", "U-Net", "Object detection", "Multi-object tracking", "Semantic segmentation", "Camera calibration", "Transfer learning"] },
    { group: "Machine Learning", items: ["PyTorch", "scikit-learn", "Transformers", "XGBoost", "LambdaMART", "Clustering", "SHAP"] },
    { group: "Generative AI & NLP", items: ["Conditional diffusion", "RAG", "Vector databases", "LLM semantic matching"] },
    { group: "Robotics & Edge", items: ["ROS 2", "Sensor synchronisation", "GPS / IMU", "ZED SDK", "ONNX", "TensorRT", "CUDA", "NVIDIA Jetson", "Docker"] },
    { group: "Programming & Data", items: ["Python", "C / C++", "SQL", "PL/SQL", "NumPy", "Pandas", "Matplotlib"] },
    { group: "Tools", items: ["Git", "GitHub", "Jenkins", "KNIME", "ServiceNow", "Linux / Unix"] },
  ],

  education: [
    {
      degree: "M.Sc. Visual Computing",
      school: "Technische Universität Dresden",
      period: "2023 – 2027",
      lines: [
        "Thesis: Machine-Interpretable Traffic Regulations for Autonomous-Driving Compliance",
        "Coursework: Machine Learning, Computer Vision, Deep Learning for Vision, Data Management, Data Visualization, Touch Sensing, Deep Neural Network Hardware, Large Language Models",
      ],
    },
    {
      degree: "B.Tech. Electronics & Communications Engineering",
      school: "V.R. Siddhartha Engineering College, Vijayawada",
      period: "2017 – 2021",
      lines: [
        "Grade: 1.9 · Thesis: Mobile Detacher Using a Heart Rate Monitoring System",
        "Coursework: Data Structures & Algorithms, Computer Networks, Embedded C, MATLAB, Microcontroller Programming, Digital Signal Processing",
      ],
    },
  ],
};
