export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  longDescription: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
  accentColor: string;
  previewType: 'interactive-canvas' | 'code-visualizer' | 'telemetry-dashboard' | 'custom-image' | 'custom-code' | 'none';
  previewImage?: string;
  customPreviewCode?: string;
}

export interface Service {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  outcomes: string[];
  highlight: string;
}

export interface SkillCategory {
  name: string;
  description: string;
  skills: { name: string; tag: string; level?: string }[];
}

export interface ProcessStep {
  step: string;
  title: string;
  phase: string;
  description: string;
  outputs: string[];
}

export const PORTFOLIO_DATA = {
  identity: {
    name: "BRACKNODES",
    wordmark: "BRACKNODES.IN",
    role: "Next-Gen Cloud & Discord Bot Hosting",
    tagline: "RELIABLE HOSTING FOR EVERYONE.",
    subheading:
      "High-speed NVMe cPanel Web Hosting, 24/7 Discord Bot Hosting, and low-latency cloud infrastructure engineered for developers, communities, and businesses. Starting at just ₹29/month.",
    status: "All Server Nodes Operational — 99.99% Uptime SLA",
    location: "India (Asia-South Datacenters)",
    email: "support@bracknodes.in",
    socials: {
      github: "https://github.com/bracknodes",
      linkedin: "https://www.linkedin.com/company/bracknodes",
      instagram: "https://www.instagram.com/bracknodes",
      x: "https://x.com/bracknodes",
    },
    meta: {
      experienceYears: "99.99%",
      focusAreas: ["Discord Bot Hosting", "cPanel NVMe Hosting", "DDoS Shield", "Cloud VPS"],
    },
  },

  philosophy: [
    {
      title: "Zero-Sleep Uptime",
      text: "Continuous 24/7 availability for your Discord bots and web applications powered by high-availability NVMe nodes.",
    },
    {
      title: "Pure NVMe Performance",
      text: "Enterprise NVMe SSD drives deliver up to 10x faster I/O speed than conventional SATA or HDD hosting.",
    },
    {
      title: "Honest & Transparent",
      text: "India's most affordable developer-friendly hosting with transparent renewals, starting at just ₹29/month with zero hidden charges.",
    },
  ],

  projects: [
    {
      id: "discord-bot-hosting",
      title: "DISCORD BOT HOSTING",
      category: "24/7 Runtime / Pterodactyl Panel",
      year: "2026",
      description: "Zero Sleep • Always Online. Keep your Python, Node.js, Java, and Go bots online 24/7 with full console access.",
      longDescription:
        "Engineered on modern Pterodactyl control panels with automated crash detection, instant restart triggers, full SFTP file access, and built-in DDoS shielding.",
      tags: ["Pterodactyl", "Node.js", "Python", "Java", "DDoS Shield", "Instant Setup"],
      metrics: [
        { label: "Price", value: "₹29 /mo" },
        { label: "Online", value: "24/7 Active" },
        { label: "Uptime", value: "99.99% SLA" },
      ],
      liveUrl: "https://bracknodes.in/",
      repoUrl: "https://github.com/bracknodes",
      featured: true,
      accentColor: "#C7FF6B",
      previewType: "interactive-canvas",
    },
    {
      id: "cpanel-web-hosting",
      title: "NVME CPANEL WEB HOSTING",
      category: "High-Speed Web Hosting / cPanel",
      year: "2026",
      description: "Lightning-fast website deployment powered by pure NVMe SSDs, free Let's Encrypt SSL, and industry-standard cPanel.",
      longDescription:
        "Optimized for WordPress, PHP 8.x, and custom web apps. Includes automated 1-click Softaculous script installer, free unlimited SSL certificates, and 10Gbps DDoS protection.",
      tags: ["cPanel", "NVMe SSD", "Free SSL", "LiteSpeed", "PHP 8.3", "Softaculous"],
      metrics: [
        { label: "Starting", value: "₹29 /mo" },
        { label: "Storage", value: "Pure NVMe" },
        { label: "SSL Cert", value: "Free Lifetime" },
      ],
      liveUrl: "https://bracknodes.in/",
      repoUrl: "https://github.com/bracknodes",
      featured: true,
      accentColor: "#70B9FF",
      previewType: "code-visualizer",
    },
    {
      id: "cloud-vps-hosting",
      title: "PERFORMANCE CLOUD VPS",
      category: "Dedicated Compute / KVM Virtualization",
      year: "2026",
      description: "Scalable virtual private cloud servers with full root access, dedicated resources, and 1Gbps network uplinks.",
      longDescription:
        "Enterprise KVM virtualization running on modern multi-core AMD/Intel hardware. Tailored for production backends, multiplayer game servers, and high-traffic databases.",
      tags: ["KVM", "Full Root Access", "1Gbps Uplink", "Custom ISO", "DDoS Filtered"],
      metrics: [
        { label: "Virtualization", value: "KVM Dedicated" },
        { label: "Bandwidth", value: "1Gbps Port" },
        { label: "Protection", value: "10Gbps+ DDoS" },
      ],
      liveUrl: "https://bracknodes.in/",
      repoUrl: "https://github.com/bracknodes",
      featured: true,
      accentColor: "#C7FF6B",
      previewType: "telemetry-dashboard",
    },
  ] as Project[],

  services: [
    {
      id: "bot-hosting",
      number: "01",
      title: "Discord Bot Hosting",
      tagline: "Always-online Pterodactyl runtime for Discord communities.",
      description:
        "Keep your moderation, music, and custom Discord bots active 24/7 without needing your personal PC to stay awake. Supports Node.js, Python, Java, and Go.",
      deliverables: ["Pterodactyl Control Panel", "Real-Time Terminal Console", "Automated Crash Recovery", "Integrated DDoS Protection"],
      outcomes: ["Zero sleep mode downtime", "Sub-10ms response latency"],
      highlight: "Most Popular",
    },
    {
      id: "web-hosting",
      number: "02",
      title: "NVMe cPanel Web Hosting",
      tagline: "Ultra-fast shared hosting for developers, portfolios, and businesses.",
      description:
        "Host personal portfolios, client websites, and web apps on high-speed NVMe storage. Complete cPanel access with 1-click script installers and free SSL.",
      deliverables: ["Full cPanel Control Suite", "Softaculous 1-Click Installer", "Free Let's Encrypt SSL", "Professional Webmail Accounts"],
      outcomes: ["Instant automated activation", "Sub-second page load times"],
      highlight: "Starts @ ₹29/mo",
    },
    {
      id: "cloud-vps",
      number: "03",
      title: "Cloud VPS & Dedicated Compute",
      tagline: "Custom compute and unmetered network infrastructure.",
      description:
        "High-throughput cloud servers configured with KVM isolation, pure NVMe drives, and DDoS mitigation for demanding projects and enterprise workloads.",
      deliverables: ["Full Root & SSH Access", "Custom Linux OS Templates", "Dedicated IPv4 & IPv6", "Tier-1 Low Latency Routing"],
      outcomes: ["100% Dedicated resource allocation", "Uncompromised network throughput"],
      highlight: "Scalable Cloud",
    },
    {
      id: "managed-support",
      number: "04",
      title: "Free Migration & 24/7 Support",
      tagline: "Direct assistance from cloud infrastructure engineers.",
      description:
        "Hassle-free website and bot migrations from other hosts. Round-the-clock technical support via Discord community and rapid ticketing.",
      deliverables: ["Free cPanel Site Migration", "Database Import Assistance", "DNS Configuration & Routing", "24/7 Discord Community Help"],
      outcomes: ["Zero migration downtime", "Human-first technical guidance"],
      highlight: "24/7 Assistance",
    },
  ] as Service[],

  skills: [
    {
      name: "Hosting Platforms",
      description: "Industry-standard control panels and virtualization hypervisors.",
      skills: [
        { name: "cPanel & WHM", tag: "Web Control" },
        { name: "Pterodactyl Panel", tag: "Bot Engine" },
        { name: "KVM Hypervisor", tag: "Virtualization" },
        { name: "CloudLinux OS", tag: "Server OS" },
        { name: "Ubuntu LTS", tag: "Linux Distro" },
        { name: "LiteSpeed Web Server", tag: "High Speed" },
      ],
    },
    {
      name: "Runtimes & Databases",
      description: "Supported execution environments for bots, scripts, and applications.",
      skills: [
        { name: "Node.js (v18 - v22)", tag: "JavaScript" },
        { name: "Python (3.10 - 3.12)", tag: "Bot Runtime" },
        { name: "PHP 8.1 - 8.3", tag: "Web Engine" },
        { name: "MySQL / MariaDB", tag: "Relational DB" },
        { name: "Redis Cache", tag: "In-Memory" },
        { name: "Java & Go", tag: "Compiled" },
      ],
    },
    {
      name: "Security & Networking",
      description: "Hardware-level protection and low-latency network infrastructure.",
      skills: [
        { name: "Anycast DDoS Shield", tag: "Protection" },
        { name: "Hardware NVMe RAID 10", tag: "Redundancy" },
        { name: "Let's Encrypt SSL", tag: "Encryption" },
        { name: "CSF Firewall", tag: "Defense" },
        { name: "Automated Snapshots", tag: "Backups" },
        { name: "Tier-1 India Uplink", tag: "1Gbps Port" },
      ],
    },
    {
      name: "Developer Tools",
      description: "Utilities and interfaces for painless management and deployment.",
      skills: [
        { name: "Git Webhooks", tag: "CI/CD" },
        { name: "SFTP & SSH Access", tag: "File Transfer" },
        { name: "phpMyAdmin", tag: "Database UI" },
        { name: "Softaculous 1-Click", tag: "App Installer" },
        { name: "Cron Job Scheduler", tag: "Automation" },
        { name: "Cloud DNS Manager", tag: "Routing" },
      ],
    },
  ] as SkillCategory[],

  process: [
    {
      step: "01",
      title: "Plan & Resource Selection",
      phase: "Instant Selection",
      description:
        "Select your desired hosting tier — Discord bot hosting, shared NVMe web hosting, or cloud compute starting at just ₹29/month.",
      outputs: ["Package Specification", "Datacenter Location Selection", "Transparent Monthly Billing"],
    },
    {
      step: "02",
      title: "Automated 60-Second Provisioning",
      phase: "Instant Activation",
      description:
        "Our automated infrastructure API immediately creates your cPanel account or Pterodactyl container with ready-to-use access credentials.",
      outputs: ["cPanel / Pterodactyl Login", "Server IP & Port Details", "Instant Welcome Email"],
    },
    {
      step: "03",
      title: "Custom Domain & Free SSL Setup",
      phase: "Zero-Config Setup",
      description:
        "Point your domain nameservers to BrackNodes. Free Let's Encrypt SSL certificates generate automatically with zero manual configuration.",
      outputs: ["Nameserver Routing", "Free Lifetime SSL Certificate", "Automated HTTPS Redirect"],
    },
    {
      step: "04",
      title: "Deploy Files, Bots & Databases",
      phase: "Effortless Management",
      description:
        "Upload files via Git, SFTP, or browser file manager. Install WordPress with 1-click or start your Discord bot with real-time console streaming.",
      outputs: ["Active Web Server / Bot Instance", "Database Provisioning", "Automated Startup Script"],
    },
    {
      step: "05",
      title: "24/7 Telemetry & Health Monitoring",
      phase: "Continuous Protection",
      description:
        "Continuous 24/7 uptime monitoring, automated crash restarts, and multi-layer DDoS shielding keep your services running without interruption.",
      outputs: ["99.99% Verified Uptime", "Automated Crash Recovery", "24/7 Discord & Ticket Support"],
    },
  ] as ProcessStep[],
};
