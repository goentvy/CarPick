package com.carpick.common.dto;


import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class Pagination {
    private int totalCount;    // 전체 데이터 수
    private int currentPage;   // 현재 페이지
    private int size;          // 한 페이지당 개수

    private int startPage;     // 네비게이션 시작 번호
    private int endPage;       // 네비게이션 끝 번호
    private boolean prev;      // 이전 버튼 활성화 여부
    private boolean next;      // 다음 버튼 활성화 여부
    private int totalPage;     // 전체 페이지 수

    private static final int NAVI_SIZE = 10;

    public Pagination(int totalCount, int currentPage, int size) {
        this.totalCount = Math.max(totalCount, 0);
        this.currentPage = currentPage < 1 ? 1 : currentPage;
        this.size = size < 1 ? 10 : size;

        // 전체 페이지 수
        this.totalPage = (int) Math.ceil((double) this.totalCount / this.size);

        if (this.totalPage == 0) {
            // 데이터가 없는 경우
            this.startPage = 1;
            this.endPage = 1;
            this.prev = false;
            this.next = false;
            return;
        }

        // 네비게이션 계산 (10개 단위)
        this.endPage = (int) Math.ceil((double) this.currentPage / NAVI_SIZE) * NAVI_SIZE;
        this.startPage = this.endPage - (NAVI_SIZE - 1);

        if (this.endPage > this.totalPage) {
            this.endPage = this.totalPage;
        }

        this.prev = this.startPage > 1;
        this.next = this.endPage < this.totalPage;
    }

}
