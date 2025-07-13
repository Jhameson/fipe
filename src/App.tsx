import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Input } from "./components/ui/input";

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

  const [brandInputValue, setBrandInputValue] = useState("");
  const [listVisible, setListVisible] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const [modelInputValue, setModelInputValue] = useState("");
  const [modelListVisible, setModelListVisible] = useState(false);
  const [yearListVisible, setYearListVisible] = useState(false);
  const [yearInputValue, setYearInputValue] = useState("");

  console.log("brandInputValue", brandInputValue);

  const filteredBrands =
    brand?.filter((a) =>
      a.nome.toLowerCase().includes(brandInputValue.toLowerCase())
    ) || [];

  const filteredModels =
    model?.filter((a) =>
      a.nome.toLowerCase().includes(modelInputValue.toLowerCase())
    ) || [];

  const filteredYears =
    year?.filter((a) =>
      a.nome.toLowerCase().includes(yearInputValue.toLowerCase())
    ) || [];

  // Fecha a lista ao clicar fora
  useEffect(() => {
    if (!listVisible) return;
    function handleClickOutside(event: MouseEvent) {
      if (listRef.current && !listRef.current.contains(event.target as Node)) {
        setListVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [listVisible]);

  return (
    <div className=" h-screen flex flex-col items-center ">
      <div className="h-5/12 h-auto border max-w-[700px] w-full px-6 py-4">
        <h1 className="read-the-docs text-3xl text-center">Fipe</h1>
        <div>
          <form className="flex flex-col gap-6">
            <div className="relative ">
              <label htmlFor="brand" className="text-foreground">
                Informe a marca do veículo
              </label>
              <Input
                placeholder="Volkswagen"
                value={brandInputValue}
                onFocus={() => {
                  if (filteredBrands.length > 0) setListVisible(true);
                }}
                onChange={(e) => {
                  setBrandInputValue(e.target.value);
                  if (e.target.value && filteredBrands.length > 0) {
                    setListVisible(true);
                  } else {
                    setListVisible(false);
                  }
                }}
              />
              {brandInputValue && listVisible && filteredBrands.length > 0 && (
                <div
                  className="absolute w-full bg-white z-10"
                  role="listbox"
                  ref={listRef}
                >
                  <div className="flex flex-col border gap-2 cursor-pointer max-h-60 overflow-y-auto">
                    {filteredBrands.slice(0, 15).map((i) => (
                      <span
                        className="hover:bg-gray-400 px-2"
                        key={i.codigo}
                        role="option"
                        tabIndex={0}
                        onClick={() => {
                          setListVisible(false);
                          setBrandInputValue(i.nome);
                          handleClickBrand(i.codigo);
                        }}
                      >
                        {i.nome}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* PESQUISA PELO MODELO */}
            <div className="relative">
              <label htmlFor="brand" className="text-foreground">
                Informe o modelo do veículo
              </label>
              <Input
                placeholder="Virtus"
                value={modelInputValue}
                onChange={(e) => {
                  setModelInputValue(e.target.value);
                  if (e.target.value && filteredModels.length > 0) {
                    setModelListVisible(true);
                  } else {
                    setModelListVisible(false);
                  }
                }}
              />
              {modelInputValue &&
                modelListVisible &&
                filteredModels.length > 0 && (
                  <div
                    className="absolute w-full bg-white z-10"
                    role="listbox"
                    // ref={listRef}
                  >
                    <div className="flex flex-col border gap-2 cursor-pointer max-h-60 overflow-y-auto">
                      {filteredModels.slice(0, 15).map((i) => (
                        <span
                          className="hover:bg-gray-400 px-2"
                          key={i.codigo}
                          role="option"
                          tabIndex={0}
                          onClick={() => {
                            setModelListVisible(false);
                            setModelInputValue(i.nome);
                            handleClickModel(i.codigo);
                          }}
                        >
                          {i.nome}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
            {/* PESQUISA PELO ANO */}
            <div className="relative">
              <label htmlFor="brand" className="text-foreground">
                Selecione o ano
              </label>
              <Input
                placeholder="2022"
                value={yearInputValue}
                onChange={(e) => {
                  setYearInputValue(e.target.value);
                  if (e.target.value && filteredYears.length > 0) {
                    setYearListVisible(true);
                  } else {
                    setYearListVisible(false);
                  }
                }}
              />
              {yearInputValue && yearListVisible && (
                <div
                  className="absolute w-full bg-white z-10"
                  role="listbox"
                  // ref={listRef}
                >
                  <div className="flex flex-col border gap-2 cursor-pointer max-h-60 overflow-y-auto">
                    {filteredYears.slice(0, 15).map((i) => (
                      <span
                        className="hover:bg-gray-400 px-2"
                        key={i.codigo}
                        role="option"
                        tabIndex={0}
                        onClick={() => {
                          setYearListVisible(false);
                          setYearInputValue(i.nome);
                          handleClickYear(i.codigo);
                        }}
                      >
                        {i.nome}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </form>
          <h2>Detalhes do Veículo</h2>
          <span></span>
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
  );
}

export default App;
