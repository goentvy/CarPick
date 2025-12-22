package com.carpick.domain.guide.dto;

import java.util.List;

public class GuideDto {

    private int step;          // 1, 2, 3, 4
    private String title;      // 단계 제목
    private List<Section> sections;

    public GuideDto(int step, String title, List<Section> sections) {
        this.step = step;
        this.title = title;
        this.sections = sections;
    }

    public int getStep() {
        return step;
    }

    public String getTitle() {
        return title;
    }

    public List<Section> getSections() {
        return sections;
    }

    // 🔹 내부 클래스 (Section)
    public static class Section {

        private String subtitle;
        private List<String> items;

        public Section(String subtitle, List<String> items) {
            this.subtitle = subtitle;
            this.items = items;
        }

        public String getSubtitle() {
            return subtitle;
        }

        public List<String> getItems() {
            return items;
        }
    }
}
