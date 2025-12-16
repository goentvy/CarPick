package com.carpick.domain.payment.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/mock/kakaopay")
public class MockKakaoPayController {

    // 카카오페이 테스트 결제 Mock 페이지 구성
    @GetMapping("/redirect")
    public String redirectPage() {
        return """
            <html>
            <head>
              <style>
                body { font-family: sans-serif; background: #f3f4f6; display: flex; justify-content: center; align-items: center; height: 100vh; }
                .card { background: white; width: 360px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }
                .header { background: #facc15; padding: 16px; display: flex; justify-content: space-between; align-items: center; }
                .header h1 { margin: 0; font-size: 18px; font-weight: bold; color: black; }
                .content { padding: 24px; }
                .section { border-bottom: 1px solid #e5e7eb; padding-bottom: 12px; margin-bottom: 12px; }
                .label { color: #6b7280; font-size: 14px; }
                .value { font-weight: bold; }
                .amount { font-size: 22px; font-weight: bold; color: #facc15; }
                .btn { width: 100%; padding: 12px; border-radius: 6px; font-weight: bold; cursor: pointer; margin-top: 12px; }
                .pay { background: #facc15; color: black; }
                .pay:hover { background: #eab308; }
                .cancel { background: #e5e7eb; color: #374151; }
                .cancel:hover { background: #d1d5db; }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="header">
                  <h1>카카오페이 결제</h1>
                  <img src="https://developers.kakao.com/assets/img/about/logos/kakaopay_logo.png" height="24"/>
                </div>
                <div class="content">
                  <div class="section">
                    <div class="label">주문번호</div>
                    <div class="value">ORDER123</div>
                  </div>
                  <div class="section">
                    <div class="label">상품명</div>
                    <div class="value">테스트 상품</div>
                  </div>
                  <div class="section">
                    <div class="label">결제금액</div>
                    <div class="amount">55,000원</div>
                  </div>
                  <button class="btn pay" onclick="alert('결제가 완료되었습니다!')">결제하기</button>
                  <button class="btn cancel" onclick="alert('결제가 취소되었습니다.')">취소하기</button>
                </div>
              </div>
            </body>
            </html>
        """;
    }
}
