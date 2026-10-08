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
    intro:
      "I'm an ML engineer pursuing a Master's in Visual Computing at TU Dresden, with expertise in computer vision, real-time edge deployment (ROS 2, TensorRT, NVIDIA Jetson), generative AI and ranking models.",
    location: "Dresden, Germany",
    email: "sravanika76@gmail.com",
    github: "https://github.com/sravanikaviti13",
    linkedin: "https://www.linkedin.com/in/sravani-kaviti",
    cv: "assets/Sravani_Kaviti_CV.pdf",
  },

  about: {
    paragraphs: [
      "I'm an engineer who likes seeing machine-learning ideas actually run. I started out writing backend code for an insurance platform, moved into data analysis at Infineon, then into applied AI, and today I work on computer vision for autonomous driving.",
      "I'm happiest when a model leaves the notebook: running on a Jetson during on-road testing, or inside an app colleagues actually use.",
      "I'm finishing my M.Sc. in Visual Computing at TU Dresden, and I'm writing my thesis at FSD Fahrzeugsystemdaten on machine-interpretable traffic regulations for autonomous-driving compliance.",
    ],
    now: [
      { k: "Right now", v: "Writing my master's thesis at FSD Fahrzeugsystemdaten" },
      { k: "Thesis topic", v: "Machine-Interpretable Traffic Regulations for Autonomous-Driving Compliance" },
      { k: "Studying", v: "M.Sc. Visual Computing, TU Dresden" },
      { k: "Languages", v: "English (C1) · German (B1)" },
      { k: "Based in", v: "Dresden, Germany" },
    ],
  },

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
      tags: ["LambdaMART", "LLMs", "Semantic search", "CrewAI", "REST APIs", "Hackathons"],
      groups: [
        {
          title: "Workshop Management Application",
          bullets: [
            "Developed a Workshop Management Application adopted by approximately 200 employees within three months, supporting workshop creation, moderator assignment, feedback, and administrative workflows.",
            "Built and evaluated a LambdaMART moderator-recommendation system using skill, location, and feedback features, achieving NDCG@5 of 0.68 on 20 held-out workshops and a 25% improvement over a skill-and-location baseline.",
            "Implemented moderator-management, approval, and notification workflows, supporting approximately 15 workshops during the initial three-month rollout.",
          ],
        },
        {
          title: "LearnQuest: gamified learning application",
          bullets: [
            "Co-built a gamified learning application leveraging LLMs, with semantic search and answer evaluation: participant responses are sent to an LLM API and scored for similarity. Reached more than 100 active learners among 500+ employees.",
          ],
        },
        {
          title: "Internal hackathons",
          bullets: [
            "Fab team: built an AI-powered agent with CrewAI to explore how generative AI could enhance manufacturing mitigation strategies.",
            "Risk management: integrated REST APIs to enable smooth backend–frontend communication.",
          ],
        },
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

  /* Cards link to project.html?id=<id>. `images` and `repo` are optional. */
  projects: [
    {
      id: "tsr",
      title: "Two-Stage Traffic-Sign Recognition",
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
      kicker: "Research project · TU Dresden (LASR Lab)",
      summary:
        "Generates tactile sensor images directly from the change in a robot's state, with no depth map or 3D model in between, so scarce tactile data can be augmented instead of collected.",
      metrics: [
        { v: "89.2%", l: "usable on held-out pairs" },
        { v: "68.6%", l: "on unseen gel regions" },
      ],
      stack: ["Diffusion (DDPM)", "U-Net", "DINOv2", "Cross-attention", "PyTorch"],
      repo: "https://github.com/lasr-lab/touch-data-augmentation",
      groups: [
        {
          title: "The problem",
          bullets: [
            "Vision-based tactile sensors such as DIGIT need large datasets, but every sample means moving a robot into contact, which is slow and expensive.",
            "Geometric augmentation can't reproduce how a gel deforms, and physics simulators leave a visual gap to real sensors. Existing diffusion approaches still need depth maps or 3D reconstructions as input.",
          ],
        },
        {
          title: "What I built",
          bullets: [
            "Collected about 12K DIGIT images with a UFactory xArm7 across 7 3D-printed objects. An automated routine swept a position grid with 21 orientations and several contact forces, and logged 19 kinematic values per image (7 joint angles, end-effector pose, 6 force–torque components).",
            "Added a real-time correction step (Canny edges, Hough lines, affine re-centering) to fix image shifts caused by sensor vibration during long collection runs.",
            "Built a conditional diffusion model (DDPM, cosine schedule, 800 steps): a U-Net with two cross-attention streams, one over the sinusoidally encoded kinematic delta and one over frozen DINOv2 patch features of the source image, plus a DINO perceptual loss.",
            "Designed the evaluation: a PSPNet that I trained to segment the contact region, then IoU, MSE, PSNR and SSIM on full images and on the contact area only. Each prediction is graded high-quality, moderate or failed. A depth-recovery check confirmed the generated touches carry real contact information (depth-map SSIM 0.98).",
          ],
        },
        {
          title: "Results",
          bullets: [
            "89.2% of test pairs gave usable reconstructions (55.6% high-quality) across 5 objects. When whole regions of the gel were hidden during training, 68.6% were still usable.",
            "DINOv2 conditioning mattered most on the hard case: high-quality reconstructions rose from 22.9% to 33.9% on unseen regions, and training converged in 35–40 epochs instead of about 120.",
            "Conditioning ablation: using only the 6 end-effector pose values gave 48.8% high-quality reconstructions, against 71.6% with all 19 values in the single-object setting.",
          ],
        },
        {
          title: "Limits I found",
          bullets: [
            "On an object it had never seen, the model put the contact in the right place but reproduced the deformation of the closest training object. Fine-tuning on just 50 images of the new object raised high-quality results from 20.4% to 47.0%.",
          ],
        },
      ],
      images: [
        {
          src: "assets/projects/diffusion-workflow.png",
          caption:
            "Left: data collection (robot images paired with the kinematic condition). Middle: a U-Net denoising network conditioned on DINOv2 features and the change in robot state. Right: DDIM sampling, then evaluation at image level and on segmented masks.",
        },
      ],
    },
    {
      id: "emotion",
      title: "Explainable Multi-Label Emotion Detection",
      kicker: "TU Dresden",
      summary:
        "Fine-tuned RoBERTa and ALBERT to detect five emotions in text, then used SHAP and human labels to check whether the model can be trusted.",
      metrics: [
        { v: "0.782", l: "mean F1 (best of 13 runs)" },
        { v: "0.52", l: "mean F1 on human labels" },
      ],
      stack: ["RoBERTa", "ALBERT", "Hugging Face", "SHAP", "PyTorch"],
      repo: "https://github.com/sravanikaviti13/explainable-text-emotion-detection",
      groups: [
        {
          title: "The task",
          bullets: [
            "Predict joy, sadness, fear, anger and surprise for each text, where one text can carry several emotions (multi-label). Data came from SemEval 2025 Task 11-A: 2,768 training and 116 validation samples.",
          ],
        },
        {
          title: "What we built",
          bullets: [
            "Fine-tuned RoBERTa and ALBERT with PyTorch and Hugging Face, adding a custom classification head (three layers of 1024, 512 and 256 units with layer norm and dropout) trained with a multi-label loss and AdamW.",
            "Ran 13 experiments that changed the model, activation (ReLU vs GELU), learning rate, batch size, layer normalisation, number of fine-tuned layers (3, 5 or all) and data augmentation (synonym replacement, back-translation).",
          ],
        },
        {
          title: "Results",
          bullets: [
            "ALBERT stalled at 0.66–0.68 mean F1. A first RoBERTa setup reached 0.744, and the best configuration reached 0.782 with very low variance across emotions.",
            "More than 3 fine-tuned layers and very long training overfit. Standard text augmentation made results worse, because swapping a single word can change the emotion of a sentence.",
            "On 50–70 test samples we labelled by hand, mean F1 dropped to about 0.52: fear held up (0.75) but sadness failed completely. People disagree about emotion too, so a single benchmark number can overstate how reliable the model is.",
            "SHAP showed which words drive each prediction, for example \"automobile accident\" pushing towards fear. It also showed the model reacting to emojis, such as a sad face turning a neutral sentence into fear and sadness.",
          ],
        },
      ],
      images: [
        {
          src: "assets/projects/emotion-pipeline.png",
          caption:
            "Pipeline: pre-trained RoBERTa and ALBERT are retrained on the tokenised data, evaluated on validation data and on human-labelled data, then used to predict test labels and analysed with SHAP.",
        },
        {
          src: "assets/projects/emotion-shap.png",
          caption:
            "SHAP token attributions for three example texts: red words push an emotion up, blue words push it down.",
        },
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
        "Thesis: Mobile Detacher Using a Heart Rate Monitoring System",
        "Coursework: Data Structures & Algorithms, Computer Networks, Embedded C, MATLAB, Microcontroller Programming, Digital Signal Processing",
      ],
    },
  ],
};
