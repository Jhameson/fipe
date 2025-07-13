import axios from "axios";
import { useEffect, useState } from "react";

interface IBrand {
  codigo: string;
  nome: string;
}
interface IModelDetail {
  codigo: string;
  nome: string;
}

interface IModel {
  modelos: IModelDetail[];
}

interface IYear {
  codigo: string;
  nome: string;
}

interface IVehicleDetail {
  TipoVeiculo: number;
  Valor: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Combustivel: string;
  CodigoFipe: string;
  MesReferencia: string;
  SiglaCombustivel: string;
}

function App() {
  const [brand, setBrand] = useState<IBrand[]>();
  const [model, setModel] = useState<IModelDetail[]>();
  const [year, setYear] = useState<IYear[]>();
  const [details, setDetails] = useState<IVehicleDetail>();

  const [brandId, setBrandId] = useState<string>();
  const [modelId, setModelId] = useState<string>();

  useEffect(() => {
    axios
      .get("https://parallelum.com.br/fipe/api/v1/carros/marcas")
      .then((response) => {
        // console.log(response);
        setBrand(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleClickBrand = (i: string) => {
    axios
      .get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${i}/modelos`)
      .then((response) => {
        setModel(response.data.modelos);
        setBrandId(i);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleClickModel = (i: string) => {
    axios
      .get(
        `https://parallelum.com.br/fipe/api/v1/carros/marcas/${brandId}/modelos/${i}/anos`
      )
      .then((response) => {
        setYear(response.data);
        setModelId(i);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleClickYear = (i: string) => {
    axios
      .get(
        `https://parallelum.com.br/fipe/api/v1/carros/marcas/${brandId}/modelos/${modelId}/anos/${i}`
      )
      .then((response) => {
        setDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <div className="">
      <h1 className="read-the-docs text-3xl">Fipe</h1>
      <div className="grid grid-cols-8">
        <div className="border px-2">
          <span className="block text-center">Marca</span>
          <div className="flex flex-col gap-1 w-max">
            {brand &&
              brand.map((i, k) => (
                <span
                  className="block border-blue-700 border bg-blue-200 cursor-pointer"
                  key={k}
                  onClick={() => {
                    handleClickBrand(i.codigo);
                  }}
                >
                  {i.nome}
                </span>
              ))}
          </div>
        </div>
        <div className="border px-2">
          <span className="block text-center">Modelos</span>
          <div className="flex flex-col gap-1 w-max">
            {model &&
              model.map((i, k) => (
                <span
                  className="block border-green-700 border bg-green-200 cursor-pointer"
                  key={k}
                  onClick={() => handleClickModel(i.codigo)}
                >
                  {i.nome}
                </span>
              ))}
          </div>
        </div>
        <div className="border px-2">
          <span className="block text-center">Anos</span>
          <div className="flex flex-col gap-1 w-max">
            {year &&
              year.map((i, k) => (
                <span
                  className="block border-blue-700 border bg-blue-200 cursor-pointer"
                  key={k}
                  onClick={() => handleClickYear(i.codigo)}
                >
                  {i.nome}
                </span>
              ))}
          </div>
        </div>
        <div className="border px-2">
          <span className="block text-center">Detalhes</span>
          <div className="flex flex-col gap-1 w-max">
            {details && (
              <div className="border border-gray-500 p-2">
                <p>Tipo Veículo: {details.TipoVeiculo}</p>
                <p>Valor: {details.Valor}</p>
                <p>Marca: {details.Marca}</p>
                <p>Modelo: {details.Modelo}</p>
                <p>Ano Modelo: {details.AnoModelo}</p>
                <p>Combustível: {details.Combustivel}</p>
                <p>Código Fipe: {details.CodigoFipe}</p>
                <p>Mês Referência: {details.MesReferencia}</p>
                <p>Sigla Combustível: {details.SiglaCombustivel}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
