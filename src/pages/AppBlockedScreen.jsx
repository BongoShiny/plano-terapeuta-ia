import React from "react";
import { ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const AGENDA_URL = "https://app.vibeterapias.com.br";
const SCREENSHOT_URL = "https://media.base44.com/images/public/699c716b5aaf606ea054cadd/5b125770f_image.png";
const VIDEO_URL = "https://media.base44.com/videos/public/699c716b5aaf606ea054cadd/885b14572_planoterapeutico.mp4";

export default function AppBlockedScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f3] to-[#ede8e1] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-[#e5ddd3] overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1B3A4B] to-[#2a5a6e] px-6 py-5 text-center">
          <h1 className="text-xl md:text-2xl font-bold text-white">
            🎉 Sistema Migrado com Sucesso!
          </h1>
          <p className="text-white/80 text-sm mt-1">
            O Plano Terapêutico agora está integrado diretamente na agenda
          </p>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Novidade */}
          <div className="bg-gradient-to-r from-[#fff4ec] to-[#ffeede] border border-[#f0d5c2] rounded-xl p-4 text-center">
            <p className="text-[#C17F6A] font-bold text-lg">NOVIDADE NA AGENDA!! 🥳🥳🥳</p>
            <p className="text-[#1B3A4B] text-sm mt-2">
              <strong>Plano terapêutico integrado diretamente no perfil e totalmente automático!</strong> Se a Anamnese e a Avaliação Termal estiverem preenchidas, vai vir mais automático ainda! Fica vinculado ao agendamento do cliente.
            </p>
            <p className="text-[#5a7a6a] text-sm mt-2">
              Assista o vídeo abaixo com o passo a passo — é bem simples! Passem para as recepcionistas a novidade. 💪
            </p>
          </div>

          {/* Video */}
          <div className="rounded-xl overflow-hidden border border-[#e0d8ce] shadow-md bg-black">
            <video
              src={VIDEO_URL}
              controls
              playsInline
              className="w-full h-auto"
              poster={SCREENSHOT_URL}
            >
              Seu navegador não suporta vídeo.
            </video>
          </div>

          {/* Message */}
          <div className="bg-[#f0faf7] border border-[#b8e6d6] rounded-xl p-4 text-center">
            <p className="text-[#1B3A4B] font-semibold text-base">
              Esta funcionalidade já está implementada no agendamento!
            </p>
            <p className="text-[#5a7a6a] text-sm mt-1">
              Acesse a aba <strong>"Plano Terapêutico"</strong> dentro dos detalhes do agendamento.
            </p>
          </div>

          {/* Arrow + Button */}
          <div className="flex flex-col items-center gap-3 pt-2">
            <ArrowRight className="w-8 h-8 text-[#C17F6A] animate-bounce rotate-90 md:rotate-0" />
            <a href={AGENDA_URL} target="_blank" rel="noopener noreferrer" className="w-full max-w-xs">
              <Button className="w-full bg-gradient-to-r from-[#C17F6A] to-[#d4956e] hover:from-[#a96b58] hover:to-[#c17f6a] text-white text-base font-semibold py-6 rounded-xl shadow-lg gap-2">
                Ir para a Agenda e Testar
                <ArrowRight className="w-5 h-5" />
              </Button>
            </a>
          </div>

          {/* Cache warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <RefreshCw className="w-4 h-4 text-amber-600" />
              <span className="text-amber-800 font-semibold text-sm">Importante!</span>
            </div>
            <p className="text-amber-700 text-sm">
              Antes de verificar, limpe o cache do navegador:
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-md text-xs font-mono font-bold">CTRL + F5</span>
              <span className="text-amber-400 text-xs">ou</span>
              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-md text-xs font-mono font-bold">CTRL + SHIFT + R</span>
              <span className="text-amber-400 text-xs">ou</span>
              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-md text-xs font-mono font-bold">CMD + SHIFT + R</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}