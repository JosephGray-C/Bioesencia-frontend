import React from "react";
import "../assets/css/homepage.css";
import "../App.css";


export default function About() {
  return (
    <div className="home-main">
      <h1>Sobre nosotros</h1>
      <img
        src="/imgs/bioesencia-logo.jpg"
        alt="About Us"
        style={{
          display: "block",
          margin: "24px auto 40px auto",
          maxWidth: "900px",
          width: "100%",
          height: "auto",
          borderRadius: "10px",
          boxShadow: "0 4px 18px #0001",
          objectFit: "cover",
        }}
      />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste voluptate minima laborum aspernatur deserunt, placeat itaque doloremque voluptates dolorem doloribus, corporis optio ad modi aperiam incidunt eligendi illo provident tempora! Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed qui quia ab incidunt, inventore porro dolores mollitia minus exercitationem, vitae aliquam numquam adipisci ullam assumenda explicabo magni neque officiis distinctio. Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro alias, harum soluta nulla sint maxime inventore suscipit numquam reprehenderit nihil adipisci quae at voluptates, quisquam aut nemo eligendi rerum. Ipsam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta perspiciatis quisquam nihil beatae necessitatibus, quae architecto sit laudantium, delectus rem autem expedita illum minima animi dolores voluptates labore nobis optio.
      </p>

      <section class="main__FAQ-container">
            <div class="main__FAQ-title-container"> <h2 class="main__FAQ-title">Preguntas frecuentes</h2></div>
            
            <div class="main__accordeons-container">
                <details name="faq" class="main__container-details">
                <summary class="main__title-summary-container">
                        <div class="main__title-icon-container">
                            <svg  class="main__icon-summary" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M9.5235 4.79973C6.76257 4.92905 4.08307 6.62063 1.1722 9.66543C0.993412 9.85244 0.993412 10.1474 1.1722 10.3344C4.08307 13.3793 6.76258 15.0709 9.52351 15.2003C12.2733 15.3291 15.2667 13.9138 18.8217 10.3399C19.0086 10.152 19.0086 9.84814 18.8217 9.6602C15.2667 6.0863 12.2733 4.67093 9.5235 4.79973ZM9.47509 3.7592C12.6521 3.61039 15.9149 5.26347 19.5564 8.92433C20.1479 9.5189 20.1479 10.4812 19.5564 11.0758C15.9149 14.7366 12.6521 16.3897 9.47508 16.2408C6.30917 16.0924 3.3912 14.1603 0.42305 11.0555C-0.141017 10.4655 -0.141017 9.53435 0.423051 8.94433C3.3912 5.8396 6.30918 3.90749 9.47509 3.7592Z"></path>
                                <path d="M13.5807 10.0002C13.5807 11.9741 11.9742 13.5586 10.012 13.5586C8.04979 13.5586 6.44327 11.9741 6.44327 10.0002C6.44327 8.02617 8.04979 6.44176 10.012 6.44176C11.9742 6.44176 13.5807 8.02617 13.5807 10.0002ZM10.012 12.5169C11.4096 12.5169 12.5426 11.3901 12.5426 10.0002C12.5426 8.6102 11.4096 7.48342 10.012 7.48342C8.61438 7.48342 7.48138 8.6102 7.48138 10.0002C7.48138 11.3901 8.61438 12.5169 10.012 12.5169Z"></path></svg>
                                <h3 class="main__title-summary">Quienes somos?</h3>
                        </div>
                        <svg  aria-hidden="true" focusable="false" class="main__row-icon-summary" viewBox="0 0 10 6">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor">
                        </path></svg>
                 </summary>
                    <div class="main__content-details-container">                    
                        <p class="main__content-details">
                            En Bioesencia CR nos especializamos en promover el bienestar integral, conectando cuerpo, mente y emociones. Combinamos psicología, terapias naturales y herramientas de desarrollo personal para ayudarte a reconectar con tu esencia y vivir en equilibrio. Nuestro compromiso es acompañarte en tu proceso de sanación y crecimiento, brindando un espacio seguro, humano y profesional.
                        </p>
                    </div>
                </details>
                <details name="faq" class="main__container-details">
                    <summary class="main__title-summary-container">
                        <div class="main__title-icon-container">
                            <svg class="main__icon-summary" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M1.16154 11.8423L8.09186 18.829C8.28991 19.0287 8.61108 19.0284 8.80882 18.8285L18.839 8.68572C18.9337 8.58998 18.9868 8.46032 18.9868 8.32514V1.53212C18.9868 1.25006 18.76 1.02141 18.4802 1.02141L11.387 1.02147C11.2527 1.02147 11.1238 1.07529 11.0288 1.17108L1.16151 11.1201C0.963704 11.3195 0.963715 11.6428 1.16154 11.8423ZM20 1.53212C20 0.685947 19.3196 -6.58649e-06 18.4802 0L11.387 5.82026e-05C10.9839 6.15389e-05 10.5973 0.161509 10.3123 0.448879L0.445049 10.3979C-0.148378 10.9962 -0.148346 11.9662 0.445123 12.5645L7.37544 19.5513C7.96958 20.1502 8.9331 20.1495 9.52633 19.5496L19.5565 9.40686C19.8405 9.11967 20 8.73068 20 8.32514V1.53212Z" fill-rule="evenodd"></path>
                                <path d="M15.9028 8.22958C14.7801 9.36148 12.9597 9.36148 11.837 8.22958C10.7142 7.09769 10.7142 5.26253 11.837 4.13064C12.9597 2.99875 14.7801 2.99875 15.9028 4.13064C17.0256 5.26253 17.0256 7.09769 15.9028 8.22958ZM12.5534 7.50734C13.2805 8.24034 14.4593 8.24034 15.1864 7.50734C15.9135 6.77433 15.9135 5.58589 15.1864 4.85289C14.4593 4.11988 13.2805 4.11988 12.5534 4.85289C11.8263 5.58589 11.8263 6.77433 12.5534 7.50734Z"></path></svg>
                                <h3 class="main__title-summary">Como agendar una cita?</h3>
                        </div>
                        <svg  aria-hidden="true" focusable="false" class="main__row-icon-summary" viewBox="0 0 10 6">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor">
                        </path></svg>
                    </summary>
                    <div class="main__content-details-container">
                        <p class="main__content-details"> Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem ullam est hic commodi nostrum nihil quisquam distinctio voluptates reprehenderit debitis? Repudiandae esse unde ab voluptate porro quam molestias, facere harum?</p>
                    </div>
                </details>
           
                <details name="faq" class="main__container-details">
                    <summary class="main__title-summary-container">
                        <div class="main__title-icon-container">
                            <svg class="main__icon-summary" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M10.7058 0.549946C11.0066 0.550342 11.3069 0.550737 11.5727 0.54775C12.6717 0.535401 13.4169 1.32825 13.7106 1.83393L15.3904 4.63773L16.1669 4.22927C16.3476 4.13421 16.5679 4.15856 16.7235 4.29078C16.879 4.42299 16.9386 4.63651 16.8739 4.83016L15.5307 8.85205C15.45 9.09376 15.2004 9.23609 14.9512 9.18246L10.5904 8.24369C10.3905 8.20066 10.2369 8.04021 10.2027 7.8386C10.1684 7.63698 10.2604 7.43484 10.4349 7.32822L11.3466 6.77121L10.491 5.35356L9.16947 7.63949C9.0331 7.87537 8.73297 7.95865 8.49456 7.82675L5.46517 6.15084C5.34568 6.08474 5.25843 5.97265 5.22367 5.8406C5.18892 5.70854 5.20968 5.56802 5.28114 5.45166C5.75753 4.67599 6.64634 3.14684 7.2264 2.14351C7.52092 1.63407 7.80943 1.26638 8.12347 1.01328C8.44922 0.750745 8.77858 0.630664 9.11576 0.579998C9.12637 0.578405 9.13702 0.577153 9.14771 0.576245C9.4761 0.548329 10.0919 0.549139 10.7058 0.549946ZM10.925 4.13746L12.4598 6.68024C12.6019 6.91575 12.5271 7.22186 12.2924 7.36528L12.0238 7.52936L14.724 8.11064L15.5313 5.69358L15.4374 5.74295C15.2026 5.8665 14.9121 5.78506 14.7757 5.55742L12.8469 2.33802C12.6459 1.99038 12.1756 1.54104 11.584 1.54769C11.2714 1.5512 10.9415 1.55066 10.6262 1.55014C10.059 1.54921 9.53863 1.54836 9.24893 1.5713C9.06973 1.60012 8.91602 1.65888 8.75098 1.79189C8.72575 1.81222 8.69986 1.83462 8.67329 1.85932C9.41082 2.17381 10.3422 2.86027 10.925 4.13746ZM8.06135 2.69724C7.58009 3.52944 6.89514 4.70818 6.40422 5.52752L8.5493 6.71421L9.91606 4.35001C9.36655 3.30179 8.53989 2.84656 8.06135 2.69724Z"></path>
                                <path d="M18.8984 16.3552C18.7447 16.6138 18.5913 16.872 18.4584 17.1022C17.909 18.0541 16.847 18.2912 16.2622 18.2861L12.9938 18.3026L12.9496 19.1788C12.9393 19.3827 12.806 19.5598 12.613 19.6263C12.4199 19.6928 12.2059 19.6352 12.0722 19.4809L9.29638 16.2755C9.12955 16.0828 9.1343 15.7955 9.30742 15.6085L12.3375 12.3349C12.4764 12.1848 12.6927 12.1345 12.8837 12.2078C13.0746 12.2811 13.2016 12.4632 13.2044 12.6677L13.219 13.736L14.8748 13.7223L13.5815 11.4203C13.4481 11.1827 13.5294 10.8821 13.7644 10.7442L16.7502 8.99179C16.8679 8.92267 17.0089 8.90473 17.1402 8.94212C17.2715 8.97951 17.3818 9.06899 17.4455 9.18978C17.8701 9.99496 18.7328 11.539 19.3005 12.5494C19.5887 13.0624 19.758 13.498 19.8157 13.8972C19.8756 14.3113 19.8111 14.6559 19.6828 14.9718C19.6788 14.9817 19.6745 14.9916 19.6698 15.0012C19.5264 15.298 19.2119 15.8274 18.8984 16.3552ZM15.7 14.7155L12.73 14.7401C12.455 14.7424 12.2297 14.522 12.2259 14.247L12.2216 13.9323L10.3454 15.9593L12.0136 17.8856L12.019 17.7797C12.0324 17.5147 12.2505 17.3063 12.5158 17.3049L16.2688 17.2861C16.6703 17.2904 17.2966 17.1147 17.5924 16.6023C17.7487 16.3315 17.9172 16.048 18.0784 15.7769C18.3682 15.2895 18.6342 14.8421 18.7621 14.5812C18.8286 14.4123 18.8564 14.2501 18.826 14.0403C18.8214 14.0083 18.8153 13.9746 18.8076 13.9391C18.1612 14.4134 17.0959 14.8649 15.7 14.7155ZM18.3985 12.9856C17.9278 12.1474 17.2627 10.9574 16.8079 10.1174L14.6937 11.3582L16.0313 13.7391C17.2132 13.8005 18.0262 13.3212 18.3985 12.9856Z"></path>
                                <path d="M1.15621 15.7354C1.00906 15.473 0.862139 15.2111 0.729208 14.9809C0.179617 14.0291 0.505229 12.9909 0.801973 12.487L2.42199 9.6482L1.68529 9.17176C1.51385 9.06089 1.42705 8.85692 1.466 8.65651C1.50496 8.4561 1.66185 8.2995 1.86233 8.26092L6.0262 7.45965C6.27645 7.4115 6.52288 7.55926 6.59829 7.80269L7.91826 12.0636C7.97877 12.259 7.91423 12.4715 7.7553 12.6002C7.59636 12.7289 7.37508 12.7478 7.1966 12.648L6.26413 12.1265L5.4481 13.5673L8.08835 13.5983C8.3608 13.6015 8.58054 13.8222 8.58248 14.0947L8.60717 17.5567C8.60815 17.6932 8.55323 17.8242 8.45518 17.9193C8.35714 18.0143 8.22448 18.0651 8.08803 18.0599C7.17842 18.025 5.4099 18.0001 4.25104 17.9865C3.66263 17.9796 3.20071 17.9084 2.82615 17.7588C2.43762 17.6036 2.17147 17.3755 1.96199 17.1064C1.9554 17.098 1.94909 17.0893 1.94306 17.0804C1.75771 16.8079 1.45648 16.2708 1.15621 15.7354ZM4.1754 13.7853L5.63906 11.201C5.77463 10.9616 6.07809 10.8767 6.31818 11.011L6.59287 11.1646L5.77555 8.52624L3.27316 9.00778L3.36221 9.06537C3.58504 9.20948 3.65648 9.50256 3.52495 9.73304L1.66481 12.9926C1.46034 13.3382 1.29934 13.9685 1.59519 14.4808C1.75154 14.7515 1.91278 15.0392 2.06695 15.3144C2.34421 15.8091 2.59863 16.2631 2.76066 16.5043C2.87365 16.6464 3.00022 16.7515 3.19707 16.8302C3.22716 16.8422 3.25937 16.8538 3.29393 16.8648C3.20641 16.0678 3.34805 14.9195 4.1754 13.7853ZM4.32426 16.9873C5.28553 16.9987 6.6487 17.0177 7.60349 17.0439L7.586 14.5925L4.85535 14.5605C4.2112 15.5533 4.21977 16.497 4.32426 16.9873Z"></path></svg>
                                <h3 class="main__title-summary">Por que confiar en Biosencia?</h3>
                        </div>
                        <svg  aria-hidden="true" focusable="false" class="main__row-icon-summary" viewBox="0 0 10 6">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor">
                        </path></svg>
                    </summary>
                    <div class="main__content-details-container">
                        <p class="main__content-details">
                            Contamos con amplia experiencia en psicología, terapias integrales y bienestar emocional.
                            Ofrecemos un trato personalizado y respetuoso, adaptado a tus necesidades.
                            Trabajamos con ética, profesionalismo y compromiso con tu proceso.
                            Integramos técnicas científicas y terapias naturales para un acompañamiento completo.
                            Más que un servicio, te brindamos un espacio seguro para crecer y sanar.
                        </p>
                    </div>
                </details>
            
                <details name="faq" class="main__container-details">
                    <summary class="main__title-summary-container">
                        <div class="main__title-icon-container">
                            <svg class="main__icon-summary" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M9.69502 0.6786C9.91338 0.601796 10.1516 0.603123 10.3691 0.682353L18.2151 3.54058C18.61 3.68445 18.8728 4.05988 18.8728 4.48018V14.4287C18.8728 14.8074 18.6588 15.1537 18.32 15.3231L10.4731 19.2465C10.196 19.385 9.87022 19.3873 9.59117 19.2526L1.45405 15.3244C1.10843 15.1576 0.888794 14.8076 0.888794 14.4239V4.48434C0.888794 4.05997 1.15665 3.68181 1.55699 3.541L9.69502 0.6786ZM6.07999 3.01017L2.5346 4.25719L10.149 7.63545L13.5692 6.118L6.07999 3.01017ZM6.78606 2.76183L14.1997 5.83828L17.5367 4.35774L10.0268 1.62195L6.78606 2.76183ZM1.88879 14.4239L1.88879 5.06467L9.64898 8.50762V18.1701L1.88879 14.4239ZM17.8728 14.4287L10.649 18.0405V8.50762L17.8728 5.30263V14.4287Z" fill-rule="evenodd"></path></svg>
                            <h3 class="main__title-summary">Como contactarnos?</h3>                       
                        </div>
                        <svg  aria-hidden="true" focusable="false" class="main__row-icon-summary" viewBox="0 0 10 6">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor">
                        </path></svg>
                    </summary>
                    <div class="main__content-details-container">
                         <p class="main__content-details">
                            <a className="nav-link" href="/#contactsection">Contactanos</a>
                        </p>
                    </div>
                </details>
            </div>
        </section>
    </div>
  );
}
