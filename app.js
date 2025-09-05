(function (window, document) {
  let currentMode = "local";
  let currentImageBlob = null;

  switchMode(currentMode);

  const examples = {
    sequence: `@startuml
!theme plain
title Order Processing Flow

actor Customer as Customer
participant "E-commerce Website" as Web
participant "Order System" as Order
participant "Inventory System" as Inventory
participant "Payment System" as Payment

Customer -> Web: Place order
Web -> Order: Create order
Order -> Inventory: Check stock

alt Stock available
    Inventory --> Order: Stock confirmed
    Order -> Payment: Process payment
    
    alt Payment successful
        Payment --> Order: Payment confirmed
        Order -> Inventory: Deduct stock
        Order --> Web: Order success
        Web --> Customer: Order confirmation
    else Payment failed
        Payment --> Order: Payment failed
        Order --> Web: Order failed
        Web --> Customer: Payment error
    end
    
else Out of stock
    Inventory --> Order: Out of stock
    Order --> Web: Item unavailable
    Web --> Customer: Out of stock notice
end

@enduml`,

    class: `@startuml
!theme plain
title E-commerce System Class Diagram

class User {
    -userId: String
    -username: String
    -email: String
    -password: String
    +login(): boolean
    +logout(): void
    +updateProfile(): void
}

class Product {
    -productId: String
    -name: String
    -price: BigDecimal
    -stock: int
    -description: String
    +updateStock(quantity: int): void
    +getPrice(): BigDecimal
}

class Order {
    -orderId: String
    -orderDate: Date
    -status: OrderStatus
    -totalAmount: BigDecimal
    +addItem(product: Product, quantity: int): void
    +calculateTotal(): BigDecimal
    +updateStatus(status: OrderStatus): void
}

class OrderItem {
    -quantity: int
    -unitPrice: BigDecimal
    +getSubtotal(): BigDecimal
}

enum OrderStatus {
    PENDING
    CONFIRMED
    SHIPPED
    DELIVERED
    CANCELLED
}

User ||--o{ Order : places
Order ||--o{ OrderItem : contains
OrderItem }o--|| Product : references
Order ||--|| OrderStatus : has

@enduml`,

    usecase: `@startuml
!theme plain
title Online Learning System Use Cases

left to right direction

actor Student as Student
actor Teacher as Teacher
actor Admin as Admin

rectangle "Online Learning System" {
    
    rectangle "Student Features" {
        Student -- (Register Account)
        Student -- (Browse Courses)
        Student -- (Purchase Course)
        Student -- (Watch Videos)
        Student -- (Download Materials)
        Student -- (Join Discussions)
        Student -- (Submit Assignment)
    }
    
    rectangle "Teacher Features" {
        Teacher -- (Upload Course)
        Teacher -- (Edit Course Content)
        Teacher -- (Grade Assignments)
        Teacher -- (Reply to Discussions)
        Teacher -- (View Learning Statistics)
    }
    
    rectangle "Admin Features" {
        Admin -- (Manage Users)
        Admin -- (Review Courses)
        Admin -- (System Settings)
        Admin -- (Generate Reports)
    }
    
    (Purchase Course) ..> (Register Account) : <<include>>
    (Watch Videos) ..> (Purchase Course) : <<include>>
    (Submit Assignment) ..> (Watch Videos) : <<extend>>
}

@enduml`,

    activity: `@startuml
!theme plain
title Customer Support Ticket Handling Process

start

:Receive customer ticket;
:Auto-categorize ticket;

if (Urgent ticket?) then (Yes)
    :Immediately notify on-call staff;
else (No)
endif

:Assign to appropriate support staff;
:Support staff starts handling;

repeat
    :Analyze issue;
    :Provide solution;
    :Communicate with customer;
    
    if (Issue resolved?) then (Yes)
        :Mark ticket as resolved;
        break
    else (No)
        if (Need escalation?) then (Yes)
            :Escalate to senior support;
        else (No)
        endif
    endif
repeat while (Continue handling?)

:Customer confirms satisfaction;

if (Customer satisfied?) then (Yes)
    :Close ticket;
else (No)
    :Reopen ticket;
    backward :Support staff starts handling;
endif

:Record resolution;
:Update knowledge base;

stop

@enduml`,
  };

  function switchMode(mode) {
    currentMode = mode;

    // Update tab status
    document.querySelectorAll(".mode-tab").forEach((tab) => {
      tab.classList.remove("active");
    });
    document
      .querySelector(`.mode-tab[onclick="switchMode('${mode}')"]`)
      .classList.add("active");

    // Update content display
    document.querySelectorAll(".mode-content").forEach((content) => {
      content.classList.remove("active");
    });
    document.getElementById(`${mode}-mode`).classList.add("active");
  }

  async function generateDiagram() {
    const input = document.getElementById("plantUmlInput").value.trim();
    const loading = document.getElementById("loading");
    const preview = document.getElementById("diagramPreview");
    const errorMessage = document.getElementById("errorMessage");
    const placeholder = document.getElementById("placeholderText");
    const format = document.querySelector('input[name="format"]:checked').value;

    if (!input) {
      showError("Please enter PlantUML code");
      return;
    }

    // Show loading state
    loading.style.display = "block";
    preview.style.display = "none";
    errorMessage.style.display = "none";
    placeholder.style.display = "none";

    try {
      if (currentMode === "cloud") {
        await generateWithCloud(input, format);
      } else {
        await generateWithLocal(input, format);
      }
    } catch (error) {
      loading.style.display = "none";
      showError("Generation failed: " + error.message);
    }
  }

  async function generateWithCloud(input, format) {
    const encodedCode = plantumlEncoder.encode(input);
    const imageUrl = `https://www.plantuml.com/plantuml/${format}/${encodedCode}`;

    const testImage = new Image();
    testImage.onload = function () {
      const loading = document.getElementById("loading");
      const preview = document.getElementById("diagramPreview");

      preview.src = imageUrl;
      preview.style.display = "block";
      loading.style.display = "none";

      // Convert image to blob for download
      fetch(imageUrl)
        .then((response) => response.blob())
        .then((blob) => {
          currentImageBlob = blob;
        });
    };

    testImage.onerror = function () {
      document.getElementById("loading").style.display = "none";
      showError(
        "Cloud service could not generate the diagram. Please check syntax or network connection."
      );
    };

    testImage.src = imageUrl;
  }

  async function generateWithLocal(input, format) {
    const serverUrl = document.getElementById("serverUrl").value;

    if (!serverUrl) {
      throw new Error("Please set the backend server URL");
    }

    const response = await fetch(serverUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: input,
        format: format,
      }),
    });

    if (!response.ok) {
      let errorMsg = "Server error";
      try {
        const errorData = await response.json();
        errorMsg = errorData.error || errorMsg;
      } catch (e) {
        errorMsg = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMsg);
    }

    const imageBlob = await response.blob();
    currentImageBlob = imageBlob;

    const imageUrl = URL.createObjectURL(imageBlob);
    const loading = document.getElementById("loading");
    const preview = document.getElementById("diagramPreview");

    preview.src = imageUrl;
    preview.style.display = "block";
    loading.style.display = "none";
  }

  function showError(message) {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
  }

  function clearInput() {
    document.getElementById("plantUmlInput").value = "";
    document.getElementById("diagramPreview").style.display = "none";
    document.getElementById("errorMessage").style.display = "none";
    document.getElementById("placeholderText").style.display = "block";
    currentImageBlob = null;
  }

  function downloadDiagram() {
    if (!currentImageBlob) {
      showError("Please generate a diagram first");
      return;
    }

    const format = document.querySelector('input[name="format"]:checked').value;
    const url = URL.createObjectURL(currentImageBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `plantuml-diagram.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function loadExample(type) {
    document.getElementById("plantUmlInput").value = examples[type];
    generateDiagram();
  }

  // Auto-load initial chart
  window.onload = function () {
    generateDiagram();
  };

  // Shortcut key support
  document
    .getElementById("plantUmlInput")
    .addEventListener("keydown", function (e) {
      if (e.ctrlKey && e.key === "Enter") {
        generateDiagram();
      }
    });

  // Export function
  window.loadExample = loadExample;
  window.switchMode = switchMode;
  window.generateDiagram = generateDiagram;
  window.clearInput = clearInput;
  window.downloadDiagram = downloadDiagram;
})(window, document);
