declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options?: any) => void;
  }
  
  function jsPDF(options?: any): jsPDF;
  
  export = jsPDF;
}

declare global {
  interface Window {
    jsPDF: any
  }
}